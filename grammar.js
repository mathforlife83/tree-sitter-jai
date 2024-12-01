/// <reference types="tree-sitter-cli/dsl" />
// @ts-nocheck

const PREC = {
    PARENTHESES:     -1,
    ASSIGNMENT:       1,
    TERNARY:          2,
    LOGICAL_OR:       3,
    LOGICAL_AND:      4,
    BITWISE_OR:       6,
    BITWISE_XOR:      5,
    BITWISE_AND:      7,
    BITWISE_AND_NOT:  8,
    EQUALITY:         9,
    COMPARE:          10,
    SHIFT:            11,
    ADD:              12,
    MULTIPLY:         13,
    CAST:             14,
    IN:               15,
    UNARY:            16,
    CALL:             17,
    MEMBER:           18,
    MATRIX:           19,
    VARIADIC:         20,
};

module.exports = grammar({
    name: "jai",

    conflicts: $ => [
        [$.struct_literal],
        [$.member_expression],
        [$.procedure, $.procedure_type],
        [$.procedure_type, $.parameterized_struct_type],
        [$.procedure_type],
        [$.parameterized_struct_type],
        [$.call_expression, $.parameterized_struct_type],
        [$.call_expression, $.parameterized_struct_type, $.types],
        [$.binary_expression, $.pointer_expression],
        [
            $.variable_declaration,
            $.assignment_statement,
            $.update_statement,
            $.const_declaration
        ],
    ],

    // None. Try to do as much as possible in here
    // externals: $ => [ ],

    extras: $ => [
        $.comment,
        $.block_comment,
        /\s/,
        $.deprecated_directive
    ],

    supertypes: $ => [
        $.declarations,
        $.expressions,
        $.literal,
        $.all_statements,
        $.no_comma_statements,
        $.types
    ],

    word: $ => $.identifier,

    rules: {
        source_file: $ => seq(
            repeat(
                seq($.declarations, ';')
            ),
            optional($.declarations)
        ),


        // Procedure and Global scope
        declarations: $ => choice(
            $.compiler_declaration,
            $.run_statement,

            $.procedure_declaration,
            $.struct_declaration,
            $.enum_declaration,
            $.variable_declaration,
            $.const_declaration,
            // $.expressions,
        ),

        // In procedure scopes
        statement: $ => choice( // TODO: prec ?
            seq($.all_statements, ';'),
            $.no_comma_statements,
        ),

        all_statements: $ => prec.left(choice(
            $.block,
            $.compiler_declaration,
            $.run_statement,

            $.procedure_declaration,
            $.struct_declaration,
            $.enum_declaration,

            $.const_declaration,
            $.variable_declaration,

            $.assignment_statement,
            $.update_statement,

            $.if_statement,
            $.if_case_statement,
            $.while_statement,
            $.for_statement,

            $.defer_statement,
            $.return_statement,
            $.break_statement,
            $.continue_statement,

            $.expressions,
        )),

        no_comma_statements: $ => prec.left(1, choice(
            $.block,
            $.run_statement, // TODO:

            $.procedure_declaration,
            $.struct_declaration,
            $.enum_declaration,

            $.if_statement,
            $.while_statement,
            $.for_statement,
            $.if_case_statement,
        )),

        // Inside statements or as arguments
        expressions: $ => prec.left(0, choice(
            $.parenthesized_expression,

            $.cast_expression,
            $.unary_expression,
            $.binary_expression,

            $.call_expression,
            $.member_expression,
            $.index_expression,

            $.if_expression,

            $.identifier,
            $.address,
            $.literal,
            $.pointer_expression,
        )),

        //
        // declarations
        //

        block: $ => prec(2, seq(
            '{',
            repeat($.statement),
            '}',
        )),

        compiler_declaration: $ => choice(
            $.import,
            $.load,
            seq('#', $.identifier)
        ),

        import: $ => seq(
            optional(seq($.identifier, ':', ':')),
            "#import",
            optional(field('modifier', choice(
                ",file",
                ",dir",
                ",string",
            ))),
            field('name', $.string),
        ),

        load: $ => seq(
            "#load",
            field('path', $.string),
        ),


        procedure_declaration: $ => seq(
            field('name', choice(
                $.identifier,
                seq(
                    'operator',
                    // I forgor which operators can be overloaded, lol
                    choice(
                        '+=', '-=', '*=', '/=', '%=', '&=', '|=',
                        '^=', '<<=', '>>=', '||=', '&&=',
                        '||', '&&', '>', '>=', '<=', '<',
                        '==', '!=', '|', '~', '&', '&~',
                        '<<', '>>', '+', '-', '*', '/', '%',
                    )
                )
            )),
            ':', ':',
            optional(field('modifier', 'inline')),
            $.procedure,
        ),

        struct_declaration: $ => prec.right(2, seq(
            field('name', $.identifier),
            ':',
            ':',
            'struct',
            // Parameterized structs
            field('modifier', optional(seq(
                '(',
                commaSep1($.parameter),
                optional(','),
                ')'
            ))),
            '{',
            optional(repeat(
                seq(
                    choice(
                        $.struct_declaration_field,
                        $.const_declaration
                    ),
                    ';'
                ),
            )),
            '}',
        )),

        enum_declaration: $ => seq(
            field('name', $.identifier),
            ':', ':',
            'enum',
            $.types,
            optional($.specified_directive),
            '{',
            sep(
                seq(
                    $.identifier,
                    optional(seq(':', ':', $.expressions))
                ),
                ';'
            ),
            '}',
        ),

        variable_declaration: $ => prec.left(seq(
            field('name', commaSep1($.identifier)),
            ':',
            choice(
                seq(
                    optional($.types),
                    '=',
                    commaSep1(choice(
                        $.expressions,
                        $.types
                    )),
                    optional(','),
                ),
                $.types
            )
        )),

        const_declaration: $ => prec.right(0, seq(
            field('name', commaSep1($.identifier)),
            ':',
            optional($.types),
            ':',
            commaSep1(
                choice(
                    $.expressions,
                    $.types
                )
            ),
        )),


        //
        // statements
        //

        run_statement: $ => seq(
            '#run',
            $.statement,
        ),

        assignment_statement: $ => prec.left(PREC.ASSIGNMENT, seq(
            commaSep1(choice($.pointer_expression, $.identifier)),
            '=',
            commaSep1(choice($.expressions, $.procedure, $.types)),
        )),

        update_statement: $ => prec.left(seq(
            commaSep1($.identifier),
            choice(
                '+=', '-=', '*=', '/=', '%=', '&=', '|=',
                '^=', '<<=', '>>=', '||=', '&&=',
            ),
            commaSep1($.expressions),
        )),

        if_statement: $ => prec.right(1, seq(
            choice('if', '#if'),
            field('condition', $.expressions),
            optional('then'),
            field('consequence', $.statement),
            optional(field('alternative', seq('else', $.statement))),
        )),

        if_case_statement: $ => seq(
            choice('if', '#if'),
            field('condition', $.expressions),
            '==',
            '{',
            repeat($.switch_case),
            '}',
        ),

        while_statement: $ => seq(
            'while',
            optional(
                field('name',
                    seq(
                        $.identifier,
                        ':',
                        optional($.types),
                        '='
                    )
                )),
            field('condition', $.expressions),
            field('body', $.statement),
        ),

        for_statement: $ => seq(
            'for',
            optional('<'),
            optional('*'),
            optional(seq(
                field('value', commaSep1($.identifier)),
                ':'
            )),
            choice(
                $.range,
                $.identifier,
            ),
            field('body', $.statement),
        ),

        break_statement: $ => prec.right(seq('break', optional($.identifier))),

        continue_statement: $ => seq('continue', optional($.identifier)),

        defer_statement: $ => seq('defer', $.statement), // TODO:

        return_statement: $ => prec.right(1, seq(
            'return',
            optional(commaSep1($.expressions)),
        )),


        //
        // expressions
        //

        parenthesized_expression: $ => prec.right(PREC.PARENTHESES,
            seq('(', $.expressions, ')')
        ),

        unary_expression: $ => prec.left(PREC.UNARY, seq(
            field('operator', choice('+', '-', '~', '!', '&')),
            field('argument', $.expressions),
        )),

        binary_expression: $ => {
            const table = [
                ['||', PREC.LOGICAL_OR],
                ['&&', PREC.LOGICAL_AND],
                ['>', PREC.COMPARE],
                ['>=', PREC.COMPARE],
                ['<=', PREC.COMPARE],
                ['<', PREC.COMPARE],
                ['==', PREC.EQUALITY],
                ['!=', PREC.EQUALITY],
                ['|', PREC.BITWISE_OR],
                ['~', PREC.BITWISE_XOR],
                ['&', PREC.BITWISE_AND],
                ['&~', PREC.BITWISE_AND_NOT],
                ['<<', PREC.SHIFT],
                ['>>', PREC.SHIFT],
                ['+', PREC.ADD],
                ['-', PREC.ADD],
                ['*', PREC.MULTIPLY],
                ['/', PREC.MULTIPLY],
                ['%', PREC.MULTIPLY],
            ];

            return choice(...table.map(([operator, precedence]) => {
                return prec.left(precedence, seq(
                    field('left', $.expressions),
                    // @ts-ignore
                    field('operator', operator),
                    field('right', $.expressions),
                ));
            }));
        },

        pointer_expression: $ => prec.right(PREC.SHIFT, seq(
            field('operator', '<<'),
            field('argument', $.expressions)
        )),

        call_expression: $ => prec.right(PREC.CALL, seq(
            optional(field('modifier', 'inline')),
            field('function', choice(
                $.identifier,
                $.parenthesized_expression
            )),
            '(',
            optional(seq(
                // Filling in default arguments is optional.
                // E.x.:
                //  procedure :: (arg1 := 1, arg2, arg3 := 3)
                //  procedure(, 2,); // arg 1 and 3 are not filled in
                commaSep1(optional(seq(
                    // Named arguments
                    //  procedure(arg2 = 2);
                    field('named_argument', optional(seq($.identifier, '='))),
                    field('argument', choice(
                        prec(1, $.expressions),
                        $.array_type,
                        $.procedure,
                    )),
                ))),
                optional(','),
            )),
            ')',
        )),

        member_expression: $ => prec.left(PREC.MEMBER, seq(
            optional($.identifier),
            '.',
            $.identifier,
        )),

        index_expression: $ => prec.left(PREC.MEMBER, seq(
            $.expressions,
            '[',
            $.expressions,
            optional(seq(',', $.expressions)),
            ']',
        )),

        type_of_expression: $ => prec.left(seq(
            'type_of',
            '(',
            $.identifier,
            ')'
        )),

        // If expressions are limited until I figure out how to make it not lag the
        // shit out of the parser...
        if_expression: $ => prec.right(seq(
            choice('ifx', '#ifx'),
            field('condition', $.expressions),
            optional('then'),
            optional(field('consequence',
                choice($.expressions, $.if_expression_block)
            )),
            optional(field('alternative',
                seq('else', choice($.expressions, $.if_expression_block))
            )),
        )),

        if_expression_block: $ => prec.right(seq(
            '{',
            optional(seq(
                prec.right(repeat(
                    seq(optional($.expressions), ';')
                ))
            )),
            '}'
        )),

        cast_expression: $ => prec.left(PREC.CAST, seq(
            // cast,force () / xx,force
            choice(
                seq(
                    'cast',
                    field('modifier', optional(seq(',', commaSep1($.identifier)))),
                    '(',
                    $.types,
                    ')'
                ),
                seq(
                    'xx',
                    field('modifier', optional(seq(',', commaSep1($.identifier)))),
                )
            ),
            $.expressions
        )),

        //
        // 
        //

        // Procedure
        procedure: $ => prec.right(PREC.ASSIGNMENT, seq(
            '(',
            field('parameters', optional(seq(
                commaSep1($.parameter),
                optional(','),
            ))),
            ')',
            optional(seq(
                '->',
                // This is a procedure that returns nothing: () -> ()
                // This is a procedure that returns a procedure; () -> (())
                field('result', choice(
                    prec.left(2, seq(
                        '(',
                        optional(commaSep1(
                            choice(
                                $.types,
                                $.named_return)
                        )),
                        ')'
                    )),
                    commaSep1(choice($.types, $.named_return)),
                ))
            )),
            optional($.block),
        )),
        named_return: $ => prec.right(2, seq(
            $.identifier,
            ':',
            $.types,
            optional(seq('=', $.literal))
        )),

        // Struct
        struct_declaration_field: $ => prec(2, prec.right(choice(
            // `identifier : type [:/=] expression;`
            seq(
                field('name', commaSep1($.identifier)),
                ':',
                choice(
                    seq(
                        $.types,
                        optional(seq(
                            choice(':', '='),
                            commaSep1(choice($.expressions, $.types)),
                            optional(','))
                        )
                    ),
                    seq(
                        choice(':', '='),
                        commaSep1(choice($.expressions, $.types)),
                        optional(',')
                    )
                )
            )
        ))),

        // Procedure and Struct
        parameter: $ => prec.right(
            seq(
                field('name', seq(
                    optional('$'),
                    $.identifier
                )),
                ':',
                choice(
                    field('type', seq(
                        optional('..'),
                        optional('$'),
                        $.types
                    )),
                    seq(
                        field('type', optional(seq(
                            optional('..'),
                            optional('$'),
                            $.types
                        ))),
                        seq(
                            '=',
                            field('default_value', choice(
                                $.expressions,
                                $.types
                            ))
                        )
                    ),
                ),
            )
        ),

        // Enum declaration
        specified_directive: $ => '#specified',

        // If case
        switch_case: $ => seq(
            'case',
            optional(field('value', $.expressions)),
            ';',
            repeat($.statement),
            optional(seq($.through_statement, ';')),
        ),
        through_statement: $ => '#through',

        // For loop
        range: $ => prec.left(PREC.MEMBER, seq(
            field('range_from', $.expressions),
            '..',
            field('range_to', $.expressions),
        )),

        //
        // Types
        //

        types: $ => prec.right(-1, choice(
            "bool",
            "string",
            "int",
            "float",
            "float64",
            "float32",
            "s64",
            "s32",
            "s16",
            "s8",
            "u64",
            "u32",
            "u16",
            "u8",
            $.identifier,
            $.pointer_type,
            $.parameterized_struct_type,
            $.anonymous_struct_type,
            $.array_type,
            $.type_of_expression,
            $.procedure_type,
        )),

        parameterized_struct_type: $ => prec.right(seq(
            field('name', $.identifier),
            '(',
            optional(seq(
                //  variable : Struct(,,) = .{};
                //  variable := Struct(,,).{};
                commaSep1(optional(seq(
                    field('named_argument', optional(seq($.identifier, '='))),
                    field('argument', choice(
                        $.expressions,
                        $.array_type,
                        $.procedure,
                        $.types
                    )),
                ))),
                optional(','),
            )),
            ')'
        )),

        // We don't want this to conflict with struct_declaration
        anonymous_struct_type: $ => prec(1, seq(
            // Valid anonymous struct syntax:
            //  variable := struct {};
            //  variable : struct {} = .{};
            'struct',

            // Also valid in terms that the compiler will not complain, but
            // useless since you cannot put anything inside the parentheses:
            //  variable := struct() {};
            //  variable : struct() {} = .{};
            // We allow them because why not.
            optional(seq( '(', ')')),

            '{',
            optional(seq(
                prec(2, repeat(
                    seq(choice(
                        $.struct_declaration_field,
                        $.const_declaration
                    ), ';')
                )),
                optional(';'),
            )),
            '}',
        )),

        // TODO : Differentiate between taking the address of a variable and pointer types
        pointer_type: $ => prec.left(seq('*', $.types)),

        procedure_type: $ => prec.left(seq(
            '(',
            optional(seq(
                commaSep1(choice(
                    $.parameter,
                    $.types
                )),
                optional(','),
            )),
            ')',
            optional(seq(
                '->',
                choice(
                    seq(
                        '(',
                        optional(commaSep1(choice($.types, $.named_return))),
                        ')'
                    ),
                    commaSep1(choice($.types, $.named_return)),
                )
            )),
        )),

        // TODO: some array type stuff that I forgor
        array_type: $ => prec.right(1, seq(
            '[',
            optional(seq(choice('..', $.expressions))),
            ']',
            optional($.types),
        )),

        //
        // literals
        //

        literal: $ => prec.right(choice(
            $.number,
            $.string,
            $.struct_literal,
            $.array_literal,
            $.boolean,
            $.null,
            $.uninitialized,
        )),

        struct_literal: $ => seq(
            optional(
                choice(
                    seq(
                        '(',
                        $.types,
                        ')'
                    ),
                    $.identifier,
                    $.anonymous_struct_type,
                ),
            ),
            '.',
            '{',
            optional(seq(
                commaSep1(choice(
                    $.expressions,
                    $.assignment_statement, // named assignment
                )),
                optional(','),
            )),
            '}',
        ),

        array_literal: $ => prec.right(2, seq(
            optional(
                choice(
                    seq('(', $.types, ')'),
                    $.types,
                ),
            ),
            '.',
            '[',
            optional(seq(
                commaSep1($.expressions),
                optional(','),
            )),
            ']',
        )),


        boolean: _ => choice('true', 'false'),
        null: _ => 'null',
        uninitialized: _ => '---',

        address: $ => seq('*', $.expressions),

        string: $ => seq(
            field('modifier', optional('#char')),
            '"',
            repeat(choice(
                $.string_content,
                $.escape_sequence,
            )),
            '"',
        ),
        string_content: _ => token.immediate(prec(1, /[^"\\]+/)),
        escape_sequence: _ => token.immediate(seq(
            '\\',
            choice(
                /[^xu0-7]/,
                /[0-7]{1,3}/,
                /x[0-9a-fA-F]{2}/,
                /u[0-9a-fA-F]{4}/,
                /u\{[0-9a-fA-F]+\}/,
                /U[0-9a-fA-F]{8}/,
            ),
        )),

        identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,

        number: _ => {
            const decimal = /[0-9][0-9_]?/;
            const hex = /0[xh][0-9a-fA-F_]?/;
            const octal = /0o[0-7][0-7]?/;
            const binary = /0b[01][01_]?/;

            const exponent_decimal = seq(
                /[eE]/,
                /[-/+]?/,
                decimal
            );
            const float_decimal = choice(
                seq(decimal, '.', optional(decimal), optional(exponent_decimal)),
                seq(decimal, exponent_decimal),
                seq('.', decimal, optional(exponent_decimal))
            );

            const exponent_hex = seq(
                /[pP]/,
                /[-/+]?/,
                decimal
            );
            const mantissa_hex = choice(
                seq(optional('_'), hex, '.', optional(hex)),
                seq(optional('_'), hex),
                seq('.', hex)
            );
            const float_hex = seq('0', /[xX]/, mantissa_hex, exponent_hex);

            const float = choice(float_hex, float_decimal);

            return token(choice(
                seq(optional('-'), decimal),
                seq(optional('-'), hex),
                seq(optional('-'), octal),
                seq(optional('-'), binary),
                seq(optional('-'), float),
            ));
        },

        // extras

        comment: _ => token(seq('//', /[^\r\n]*/)),

        // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
        block_comment: _ => token(choice(
            seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
            seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/',
            ),
        )),

        deprecated_directive: $ => choice(
            seq('#deprecated', $.string),
        ),
}
});

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @return {SeqRule}
 *
 */
function commaSep1(rule) {
    return sep1(rule, ',');
}

/**
 * Creates a rule to match zero or more occurrences of `rule` separated by `sep`
 *
 * @param {RegExp|Rule|String} rule
 *
 * @param {RegExp|Rule|String} sep
 *
 * @return {ChoiceRule}
 *
 */
function sep(rule, sep) {
    return optional(seq(rule, repeat(seq(sep, optional(rule)))));
}

/**
 * Creates a rule to match one or more occurrences of `rule` separated by `sep`
 *
 * @param {RegExp|Rule|String} rule
 *
 * @param {RegExp|Rule|String} sep
 *
 * @return {SeqRule}
 *
 */
function sep1(rule, sep) {
    return seq(rule, repeat(seq(sep, rule)));
}

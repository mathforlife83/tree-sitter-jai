// Credits to the following sources
// - tree-sitter-odin and the other tree-sitter-jai implementations (general inspiration)
// - tree-sitter-go (for the integer and floats matching)
// - tree-sitter-tlaplus (for nested block comments)

/// <reference types="tree-sitter-cli/dsl" />
// @ts-nocheck

const PREC = {
    PARENTHESES:     -1,
    ASSIGNMENT:       1,

    LOGICAL_OR:       4,
    LOGICAL_AND:      5,
    BITWISE_OR:       7,
    BITWISE_XOR:      6,
    BITWISE_AND:      8,
    BITWISE_AND_NOT:  9,
    EQUALITY:         10,
    COMPARE:          11,
    SHIFT:            12,
    ADD:              13,
    MULTIPLY:         14,
    CAST:             15,
    UNARY:            17,

    CALL:             19,
    MEMBER:           20,
    RUN:              21
};


const BIN = /[01]/;
const BIN_ = seq(optional("_"), BIN);
const BIN_INT = seq(BIN, repeat(BIN_));

const OCT = /[0-7]/;
const OCT_ = seq(optional("_"), OCT);
const OCT_INT = seq(OCT, repeat(OCT_));

const HEX = /[0-9a-fA-F]/;
const HEX_ = seq(optional("_"), HEX);
const HEX_INT = seq(HEX, repeat(HEX_));

const DEC = /[0-9]/;
const DEC_ = seq(optional("_"), DEC);
const DEC_INT = seq(DEC, repeat(DEC_));

module.exports = grammar({
    name: "jai",

    conflicts: $ => [
        [$.all_statements, $.no_semicolon_statements],
        [$.member_expression],
        [$.call_expression, $.parameterized_struct_type],
        [$.named_parameters, $.assignment_parameters],
        [$.procedure_type, $.assignment_parameters],
        [$.expressions, $.variable_declaration, $.const_declaration, $.assignment_statement, $.update_statement],
        [$.expressions, $.variable_declaration, $.const_declaration, $.assignment_statement],
        [$.polymorphic_type],
        [$.member_type, $.call_expression],
    ],

    // None. Try to do as much as possible in here
    // externals: $ => [ ],

    extras: $ => [
        $.comment,
        $.block_comment,
        // /\s|\\\r?\n/,
        /\s/,
        $.deprecated_directive
    ],

    supertypes: $ => [
        $.all_statements,
        $.no_semicolon_statements,
        $.expressions,
        $.literal,
    ],

    word: $ => $.identifier,

    rules: {
        source_file: $ => repeat(seq($.declarations, optional(';'))),

        // Procedure and Global scope
        declarations: $ => choice(
            $.run_statement,

            $.procedure_declaration,
            $.struct_declaration,
            $.enum_declaration,

            seq('#', $.if_statement),
            seq($.compiler_declaration, $.string),
            $.compiler_declaration,

            seq(
                choice(
                    $.const_declaration,
                    $.variable_declaration,
                ),
                ';'
            ),
        ),

        // In procedure scopes
        statement: $ => choice(
            seq($.all_statements, ';'),
            $.no_semicolon_statements,
            prec(-2, ';'),
        ),

        all_statements: $ => choice(
            $.block,
            $.compiler_declaration,
            $.run_statement,
            $.asm_statement,
            $.using_statement,

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
        ),

        no_semicolon_statements: $ => choice(
            $.block,
            $.run_statement,
            $.asm_statement,

            $.procedure_declaration,
            $.struct_declaration,
            $.enum_declaration,

            $.if_statement,
            $.while_statement,
            $.for_statement,
            $.if_case_statement,
        ),

        // Inside statements or as arguments
        expressions: $ => prec.right(30, choice(
            $.parenthesized_expression,

            $.cast_expression,
            $.unary_expression,
            $.binary_expression,

            $.call_expression,
            $.member_expression,
            $.index_expression,

            $.if_expression,

            prec(-1, field('name', $.identifier)),
            $.address,
            $.literal,
            $.pointer_expression,
            $.quick_procedure,

            // I don't want all types to be expressions
            // $.types,
            $.type_of_expression,
            $.run_expression
        )),

        run_expression: $ => prec(PREC.RUN, seq(
            '#run',
            choice(
                seq( // return value
                    '->',
                    field('result', choice(
                        seq(
                            '(',
                            optional(comma_sep1(
                                choice($.types, $.named_return)
                            )),
                            ')'
                        ),
                        comma_sep1(choice($.types, $.named_return)),
                    )),
                    $.block,
                ),
                $.expressions
            ),
        )),

        //
        // declarations
        //

        block: $ => prec(2, seq(
            '{',
            repeat($.statement),
            '}',
        )),

        compiler_declaration: $ => prec.right(choice(
            $.import,
            $.load,
            seq('#', comma_sep1($.identifier))
        )),

        import: $ => seq(
            optional(seq(
                field('name', $.identifier),
                ':', ':'
            )),
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
                        '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', 
                        '+',  '-',  '*',  '/',  '%',  '&',  '|',  '^',
                        '<<', '>>', '||', '&&', '<<<', '>>>',
                        '<<=', '>>=', '||=', '&&=', '<<<=', '>>>=',
                        '==', '!=', '~', '&~', '>', '>=', '<=', '<',
                        '[]', '[]=', '*[]'
                    )
                )
            )),
            ':', ':',
            optional(field('modifier', 'inline')),
            $.procedure,
        ),

        struct_declaration: $ => seq(
            field('name', $.identifier),
            ':', ':',
            choice('struct', 'union'),
            // Parameterized structs
            field('modifier', optional($.named_parameters)),
            optional(seq('#modify', $.block)),
            '{',
            optional(repeat(choice(
                seq('#as', $.using_statement),
                $.procedure_declaration,
                $.struct_declaration,
                $.enum_declaration,
                seq(
                    choice(
                        $.const_declaration,   
                        $.variable_declaration,
                        $.assignment_statement,
                        seq('#', $.if_statement),
                        seq('#place', $.expressions), // #place statements
                    ),
                    ';'
                )
            ))),
            '}',
        ),

        enum_declaration: $ => prec(1, seq( // conflict with const_declaration
            field('name', $.identifier),
            ':', ':',
            choice('enum', 'enum_flags'),
            optional(field('type', $.types)),
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
        )),

        variable_declaration: $ => seq(
            prec.right(field('name', comma_sep1($.identifier))),
            // optional(','),
            ':',
            choice(
                seq(
                    optional(field('type', $.types)),
                    '=',
                    prec.right(comma_sep1(choice($.expressions, $.procedure, $.types))),
                ),
                field('type', $.types),
            )
        ),

        const_declaration: $ => seq(
            prec.right(field('name', comma_sep1($.identifier))),
            // optional(','),
            ':',
            optional(field('type', $.types)),
            ':',
            prec.right(comma_sep1(
                choice($.expressions, $.types),
            )),
            // optional(','),
        ),

        quick_procedure: $ => seq($.identifier, '=>', $.expressions),


        //
        // statements
        //

        run_statement: $ => seq(
            '#run',
            $.statement,
        ),
    
        asm_statement: $ => prec.right(seq(
            '#asm',
            '{',
            repeat(seq($.asm_line, ';')),
            '}'
        )),

        asm_line: $ => choice(
            seq(
                field('mnemoric', seq(
                    $.identifier, optional(seq('.', $.identifier))
                )),
                choice($.identifier, $.asm_register),
                optional(seq(
                    ',',
                    choice(
                        seq('[', $.expressions, ']'),
                        $.expressions
                    ),
                ))
            ),
            $.asm_register,
        ),

        asm_register: $ => seq(
            field('register', $.identifier), ':',
            optional(seq(
                optional(seq($.identifier, '===',)),
                choice($.identifier, $.integer)
            ))
        ),

        using_statement: $ => seq(
            field('keyword', 'using'),
            $.statement,
        ),

        assignment_statement: $ => prec.left(PREC.ASSIGNMENT, seq(
            comma_sep1(choice(
                $.expressions,
                $.identifier,
            )),
            '=',
            comma_sep1(choice(
                $.expressions,
                $.procedure,
                $.types
            )),
        )),

        update_statement: $ => seq(
            comma_sep1(choice(
                $.expressions,
                $.identifier,
            )),
            choice(
                '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=',
                '<<=', '>>=', '<<<=', '>>>=', '||=', '&&=',
            ),
            comma_sep1($.expressions, $.procedure),
        ),

        if_statement: $ => prec.right(seq(
            choice('if', '#if'),
            field('condition', $.expressions),
            optional('then'),
            field('consequence', $.statement),
            optional(field('alternative', $.else_clause)),
        )),

        else_clause: $ => seq("else", $.statement),

        if_case_statement: $ => seq(
            choice('if', '#if'),
            optional('#complete'),
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

        for_statement: $ => prec.right(3, seq(
            'for',
            optional(field('modifier', '#v2')), // I guess this is temporary
            optional('<'),
            optional(field('value', seq(
                comma_sep1($.identifier),
                ':',
            ))),
            prec.right(choice(
                $.range,
                $.expressions
            )),
            field('body', $.statement),
        )),

        break_statement: $ => seq('break', optional($.identifier)),

        continue_statement: $ => seq('continue', optional($.identifier)),

        defer_statement: $ => seq('defer', $.statement),

        return_statement: $ => seq(
            'return',
            optional(comma_sep1($.expressions)),
        ),


        //
        // expressions
        //

        parenthesized_expression: $ => prec(PREC.PARENTHESES,
            seq('(', $.expressions, ')')
        ),

        unary_expression: $ => prec.left(PREC.UNARY, seq(
            field('operator', choice('+', '-', '~', '!', '&')),
            field('argument', $.expressions),
        )),

        binary_expression: $ => {
            const table = [
                ['||',  PREC.LOGICAL_OR],
                ['&&',  PREC.LOGICAL_AND],
                ['>',   PREC.COMPARE],
                ['>=',  PREC.COMPARE],
                ['<=',  PREC.COMPARE],
                ['<',   PREC.COMPARE],
                ['==',  PREC.EQUALITY],
                ['!=',  PREC.EQUALITY],
                ['|',   PREC.BITWISE_OR],
                ['~',   PREC.BITWISE_XOR],
                ['&',   PREC.BITWISE_AND],
                ['&~',  PREC.BITWISE_AND_NOT],
                ['<<',  PREC.SHIFT],
                ['>>',  PREC.SHIFT],
                ['<<<', PREC.SHIFT],
                ['>>>', PREC.SHIFT],
                ['+',   PREC.ADD],
                ['-',   PREC.ADD],
                ['*',   PREC.MULTIPLY],
                ['/',   PREC.MULTIPLY],
                ['%',   PREC.MULTIPLY],
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

        pointer_expression: $ => prec.left(seq(
            field('operator', '<<'),
            field('argument', $.expressions)
        )),

        call_expression: $ => prec.dynamic(PREC.CALL, seq(
            optional(field('modifier', 'inline')),
            field('function', choice(
                $.identifier,
                $.parenthesized_expression
            )),
            $.assignment_parameters,
        )),

        member_expression: $ => prec.left(PREC.MEMBER, seq(
            optional(choice(
                $.expressions,
                $.identifier
            )),
            '.',
            choice(
                $.identifier,
                $.call_expression
            ),
        )),

        index_expression: $ => prec.left(PREC.MEMBER, seq(
            $.expressions,
            '[',
            $.expressions,
            optional(seq(',', $.expressions)),
            ']',
        )),

        type_of_expression: $ => seq(
            'type_of',
            '(',
            $.expressions,
            ')'
        ),

        // If expressions are limited until I figure out how to make it not lag the
        // shit out of the parser...
        if_expression: $ => prec.right(seq(
            choice('ifx', '#ifx'),
            field('condition', $.expressions),
            optional('then'),
            optional(field('consequence',
                choice($.expressions, $.block)
            )),
            optional(field('alternative',
                seq('else', choice($.expressions, $.block))
            )),
        )),

        cast_expression: $ => prec(PREC.CAST, seq(
            // cast,force () / xx,force
            choice(
                seq(
                    'cast',
                    field('modifier', optional(seq(',', comma_sep1($.identifier)))),
                    '(',
                    $.types,
                    ')'
                ),
                seq(
                    'xx',
                    field('modifier', optional(seq(',', comma_sep1($.identifier)))),
                )
            ),
            $.expressions
        )),

        //
        // 
        //

        // Procedure
        procedure: $ => prec.right(1, seq(
            $.named_parameters,
            optional(seq(
                '->',
                // This is a procedure that returns nothing: () -> ()
                // This is a procedure that returns a procedure; () -> (())
                field('result', choice(
                    seq(
                        '(',
                        optional(comma_sep1(
                            choice($.types, $.named_return)
                        )),
                        ')'
                    ),
                    comma_sep1(choice($.types, $.named_return)),
                ))
            )),
            repeat($.compiler_declaration),
            optional(seq($.compiler_declaration, $.identifier)),
            optional(seq('#modify', $.block)),
            optional($.block),
        )),
        named_return: $ => prec.right(1, seq(
            $.identifier,
            ':',
            $.types,
            optional(seq('=', $.literal))
        )),

        // Procedure and Struct
        named_parameters: $ => seq(
            '(',
            field('parameters', optional(seq(
                comma_sep1(prec(1, choice($.parameter, $.types))),
                // optional(','),
            ))),
            ')'
        ),

        parameter: $ => seq(
            field('keyword', optional('using')),
            field('name', seq(
                optional('$'),
                optional('$'),
                $.identifier
            )),
            ':',
            choice(
                field('type', seq(
                    optional('..'),
                    $.types
                )),
                seq(
                    field('type', optional(seq(
                        optional('..'),
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
        ),

        assignment_parameters: $ => seq(
            '(',
            optional(seq(
                // Filling in default arguments is optional.
                // E.x.:
                //  procedure :: (arg1 := 1, arg2, arg3 := 3)
                //  procedure(, 2,); // arg 1 and 3 are not filled in
                sep1_prec_right(PREC.CALL, optional(seq(
                    // Named arguments
                    //  procedure(arg2 = 2);

                    field('named_argument',
                        optional( seq(
                            $.identifier,
                            '='
                        ))
                    ),
                    optional('..'),
                    // NOTE: this should be the same as in parameterized_struct_type.
                    // Could be merged somehow.
                    field('argument', choice(
                        $.expressions,
                        $.identifier,
                        $.procedure,
                        $.types,
                        seq('#code', $.block)
                    )),
                )), ','),
                // optional(','),
            )),
            ')',
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
        range: $ => seq(
            field('range_from', $.expressions),
            '..',
            field('range_to', $.expressions),
        ),

        //
        // Types
        //

        types: $ => prec(2, choice(
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
            $.pointer_type,
            $.anonymous_struct_type,
            $.anonymous_enum_type,
            $.array_type,
            $.type_of_expression,
            $.type_literal,
            $.procedure_type,
            $.parameterized_struct_type,
            $.polymorphic_type,
            prec(-1, $.member_type),
            prec(-2, $.identifier),
        )),

        member_type: $ => seq($.identifier, '.', $.identifier),

        polymorphic_type: $ => seq(
            optional('$'),
            '$', $.types,
            optional(seq('/', $.identifier))), // TODO: this also makes the parser bigger.

        type_literal: $ => prec.right(seq(
            '#type',
            optional(seq(',', field('modifier', $.identifier))), // #type,isa
            $.types,
        )),

        parameterized_struct_type: $ => prec.dynamic(PREC.CALL - 1, seq(
            field('type', $.identifier),
            $.assignment_parameters,
        )),

        anonymous_struct_type: $ => prec(-1, seq( // conflict with struct_declaration
            // Valid anonymous struct syntax:
            //  variable := struct {};
            //  variable : struct {} = .{};
            choice('struct', 'union'),

            // Also valid in terms that the compiler will not complain, but
            // useless since you cannot put anything inside the parentheses:
            //  variable := struct() {};
            //  variable : struct() {} = .{};
            // optional(seq( '(', ')')),

            '{',
            optional(seq(
                repeat(prec(-1,
                    seq(
                        choice(
                            $.variable_declaration,
                            $.const_declaration,
                            // $.assignment_statement, // not sure about this one
                        ),
                        ';'
                    )
                )),
                optional(';'),
            )),
            '}',
        )),

        anonymous_enum_type: $ => prec(-1, seq(
            choice('enum', 'enum_flags'),
            optional(field('type', $.types)),
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
        )),

        // TODO : Differentiate between taking the address of a variable and pointer types
        pointer_type: $ => prec.left(PREC.CAST, seq('*', $.types)),

        procedure_type: $ => prec.left(seq(
            $.assignment_parameters,
            optional(seq(
                '->',
                choice(
                    seq(
                        '(',
                        optional(comma_sep1(choice($.types, $.named_return))),
                        ')'
                    ),
                    comma_sep1(choice($.types, $.named_return)),
                )
            )),
            repeat($.compiler_declaration),
        )),

        array_type: $ => prec.right(seq(
            '[',
            optional(seq(choice('..', $.expressions))),
            ']',
            optional(
                field('type', $.types)
            ),
        )),

        //
        // literals
        //

        literal: $ => choice(
            $.integer,
            $.float,
            $.string,
            $.struct_literal,
            $.array_literal,
            $.boolean,
            $.null,
            $.uninitialized,
        ),

        // I hate this
        struct_parameters: $ => prec.dynamic(PREC.CALL,
            seq(
                '(',
                optional(seq(
                    sep1_prec_right(PREC.CALL, optional(seq(
                        optional(field('keyword', 'using')),
                        optional(field('named_argument', seq($.identifier, '='))),
                        field('argument', choice(
                            $.expressions,
                            $.identifier,
                            $.procedure,
                            $.types,
                        )),
                    )), ','),
                    // optional(','),
                )),
                ')'
            )
        ),

        struct_literal: $ => prec(PREC.CALL, seq(
            optional(
                choice(
                    seq('(', field('type', $.types), ')'),
                    field('type', $.types),
                    field('type', $.identifier),
                ),
            ),
            optional(field('parameters', $.named_parameters)),

            '.',
            '{',
            optional(
                comma_sep1(field('parameter', seq(
                    // $.assignment_statement, // This breaks
                    optional(seq($.identifier, '=')), // named
                    $.expressions,
                )))
            ),
            '}',
        )),

        array_literal: $ => prec(PREC.CALL, seq(
            optional(
                choice(
                    seq('(', field('type', $.types), ')'),
                    field('type', $.types),
                ),
            ),
            '.',
            '[',
            optional(
                comma_sep1($.expressions),
            ),
            ']',
        )),

        boolean: _ => choice('true', 'false'),
        null: _ => 'null',
        uninitialized: _ => '---',

        address: $ => prec.left(PREC.CAST, seq('*', $.expressions)),

        string: $ => seq(
            field('modifier', optional('#char')),
            '"',
            repeat(choice(
                $.string_content,
                $.escape_sequence,
            )),
            '"',
        ),
        string_content: _ => token.immediate(prec(1, /[^"\\\n]+/)),
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

        integer: _ =>
            choice(
                token(seq(choice("0b", "0B"), BIN_INT)),
                token(seq(choice("0o", "0O"), OCT_INT)),
                token(seq(choice("0x", "0X"), HEX_INT)),
                token(DEC_INT),
            ),

        float: _ =>
            choice(
                // Floats in hex
                token(seq(choice("0h", "0H"), HEX_INT)),
                token(seq(
                    choice("0x", "0h"), HEX_INT, ".", HEX_INT,
                    optional(seq(/[pP][-+]?/, DEC_INT))
                )),
                token(seq(
                    DEC_INT, ".", DEC_INT,
                    optional(seq(/[eE][-+]?/, DEC_INT))
                )),
                token(seq(
                    choice("0x", "0X"), HEX_INT, /[pP][-+]?/, DEC_INT
                )),
                token(seq(DEC_INT, /[eE][-+]?/, DEC_INT))
            ),

        // extras

        comment: _ => token(seq('//', /.*/)),
        // comment: _ => token(seq('//', /(\\+(.|\r?\n)|[^\\\n])*/)),

        // Credits and thanks to tree-sitter-tlaplus for this regex
        block_comment: $ => seq(
            token(prec(1, "/*")),
            repeat(
                $.block_comment_text,
            ),
            token(prec(1, '*/'))
        ),
        block_comment_text: $ => prec.right(repeat1(choice(
            token(prec(1, regexOr(
                '[^*/]',    // any symbol except reserved
                '[^*][/]',  // closing parenthesis, which is not a comment end
                '[/][^/*]', // opening parenthesis, which is not a comment start
                '[*][/][ \t]*(\r\n|\n)?[ \t]*[/][*]' // contiguous block comment border
            ))),
            token(prec(1, /\*/)),
            token(prec(1, /\//)),
        ))),

        deprecated_directive: $ => choice(
            seq('#deprecated', $.string),
        ),

}
});

function regexOr(regex) {
    if (arguments.length > 1) {
        regex = Array.from(arguments).join('|');
    }
    return {
        type: 'PATTERN',
        value: regex
    };
}

// Creates a rule to match zero or more occurrences of `rule` separated by `sep`
function sep(rule, s) {
    return optional(seq(rule, repeat(seq(s, optional(rule)))));
}

// Creates a rule to match one or more occurrences of `rule` separated by `sep`
function sep1(rule, s) {
    return seq(rule, repeat(seq(s, rule)));
}

// Same as sep1, but allows passing right precedence
function sep1_prec_right(p, rule, s) {
    return seq(rule, repeat(prec.right(p, seq(s, rule))));
}

// Same as sep1, but allows passing precedence
function sep1_prec(p, rule, s) {
    return seq(rule, repeat(prec(p, seq(s, rule))));
}

// Creates a rule to match one or more of the rules separated by a comma
function comma_sep1(rule) {
    return sep1(rule, ',');
}

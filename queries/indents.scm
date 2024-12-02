; Incomplete

[
  (block)
  (enum_declaration "{")
  (struct_declaration "{")
  (struct_literal "{")
  (anonymous_struct_type "{")
  (if_expression_block "{")
  (array_literal "[")
  (literal)

] @indent.begin

((if_statement) @indent.begin)
((switch_case ";") @indent.begin)

((identifier) . (ERROR "(" @indent.begin))

[
  ")"
  "]"
  "}"
] @indent.branch @indent.end


[
  (enum_declaration "}")
  (struct_declaration "}")
  (struct_literal "}")
  (anonymous_struct_type "}")
  (if_expression_block "}")
  (literal "]")
] @indent.branch @indent.end

[
  (comment)
  (block_comment)
  (string)
  (ERROR)
] @indent.auto


; Incomplete

[
  (block)
  (enum_declaration)
  (struct_declaration)
  (struct_literal)
  (anonymous_struct_type)
  (call_expression)
  (switch_case)
  (if_expression_block)
] @indent.begin

((identifier) . (ERROR "(" @indent.begin))

[
  ")"
  "]"
] @indent.branch @indent.end

(block "}" @indent.branch @indent.end)
(enum_declaration "}" @indent.branch @indent.end)
(struct_declaration "}" @indent.branch @indent.end)
(struct_literal "}" @indent.branch @indent.end)
(anonymous_struct_type "}" @indent.branch @indent.end)
(if_expression_block "}" @indent.branch @indent.end)

[
  (comment)
  (block_comment)
  (string)
  (ERROR)
] @indent.auto


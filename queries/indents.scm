; NOTE: these don't work well with Allman style

; Incomplete

[
  (block)
  (enum_declaration "{")
  (struct_declaration "{")
  (struct_literal "{")
  (anonymous_struct_type "{")
  (asm_statement "{")
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
  (literal "]")
] @indent.branch @indent.end

[
  (comment)
  (block_comment)
  (string)
  (ERROR)
] @indent.auto


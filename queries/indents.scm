; Incomplete

[
  (block)
  (enum_declaration "{")
  (struct_declaration "{")
  (struct_literal "{")
  (anonymous_struct_type "{")
  (if_expression_block "{")
  (array_literal "[")
  ; (procedure "(")
  ; (call_expression "(")
  ; (struct_declaration "(") ; parameterized
  ; (parameterized_struct_type "(")
  (literal)

] @indent.begin

((if_statement) @indent.begin)
((switch_case ";") @indent.begin)

((identifier) . (ERROR "(" @indent.begin))

; [
  ; "("
  ; "["
  ; "{"
; ] @indent.branch

[
  ")"
  "]"
  "}"
] @indent.branch @indent.end


[
  ; (block "}")
  (enum_declaration "}")
  (struct_declaration "}")
  (struct_literal "}")
  (anonymous_struct_type "}")
  (if_expression_block "}")
  (literal "]")
  ; (procedure ")")
  ; (call_expression ")")
  ; (struct_declaration ")")
  ; (parameterized_struct_type ")")
] @indent.branch @indent.end

[
  (comment)
  (block_comment)
  (string)
  (ERROR)
] @indent.auto


# tree-sitter-jai
Tree-sitter grammar for the language. It is incomplete.

This syntax now uses an external scanner. If you're using neovim, you should add "scanner.c"
into parser_config.jai.install_info.files in your lua config.

# TODO
*I prioritize fixing issues based on how badly they break the parsing*
- [x] here strings (external scanner)
- [ ] fix for loop range getting confused with floats. e.g. `0..1` is (float `0.`) (float `.1`) and `0..count` is (float `0.`) + (member_expression `.count`)
- [ ] macros, backticks, expand, insert
- [ ] there's no way diferentiate between taking the address of a variable and a pointer type (does not break the syntax highlighting or indents, so I don't really care)
- [ ] there are some situations inside else blocks where indenting is ignored and the user has to do it manually, I need to fix those
- [ ] simplify the grammar so the parser generates faster and is more lightweight

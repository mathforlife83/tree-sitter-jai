# tree-sitter-jai
Tree-sitter grammar for the language. It is incomplete.

# TODO
*I prioritize fixing issues based on how badly they break the parsing*
- [x] here strings (external scanner)
- [ ] simplify the grammar so the parser generates faster and is more lightweight
- [ ] there are some situations inside else blocks where indenting is ignored and the user has to do it manually, I need to fix those
- [ ] implement splitting identifiers (e.g. `ident\     ifier`)
- [ ] there's no way diferentiate between taking the address of a variable and a pointer type (does not break the syntax highlighting or indents, so I don't really care)

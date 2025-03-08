import oxcParser, { Directive, ImportDeclarationSpecifier, Statement } from "oxc-parser";
export const checkImport = (options:{
  path:string,
  code:string,
  member:string,
  package:string
})=>{
  const { path,code,member,package:packageName } = options
  const parseResult = oxcParser.parseSync(path, code);
  const result = !parseResult.program.body.some(item=>isMatchImport(
    item,
    member,packageName
  ))
  return result
}
const isMatchImport = ( statementResult: Directive|Statement,member:string,packageName:string)=>{
  if(statementResult.type!=="ImportDeclaration")return false
  if (statementResult.source.value !== packageName) false;
  if(!statementResult.specifiers.some((sp)=>isMatchSpecifier(sp,member))){
    return false
  }
  return true
}
const isMatchSpecifier =(sp:ImportDeclarationSpecifier,member:string)=>{
  if(sp.type !== "ImportSpecifier")return false
  if(sp.imported.type !== "Identifier")return false
  if(sp.imported.name !== member)return false
  return true 
}
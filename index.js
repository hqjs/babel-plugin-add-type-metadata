module.exports = function({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(nodePath) {
        nodePath.traverse({
          ClassMethod(methodPath) {
            const { node } = methodPath;
            if (node.key.name === 'constructor') {
              const cls = methodPath.findParent(p => t.isClassDeclaration(p) || t.isClassExpression(p));
              if (!node.params.some(n => t.isTSParameterProperty(n))) return;
              const types = node.params.map(n => t.isTSParameterProperty(n) ?
                n.parameter.typeAnnotation.typeAnnotation.typeName.name :
                null);
              const typeMetadata = t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.identifier(cls.node.id.name),
                  t.identifier('ctorParameters')
                ),
                t.functionExpression(
                  null,
                  [],
                  t.blockStatement([
                    t.returnStatement(t.arrayExpression(types.map(type => type ?
                      t.objectExpression([
                        t.objectProperty(
                          t.stringLiteral('type'),
                          t.identifier(type)
                        ),
                      ]) :
                      t.nullLiteral()))),
                  ])
                )
              );
              nodePath.insertAfter(t.expressionStatement(typeMetadata));
            }
          },
        });
      },
    },
  };
};

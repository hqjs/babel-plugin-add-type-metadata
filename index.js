module.exports = function ({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(nodePath) {
        nodePath.traverse({
          ClassMethod(methodPath) {
            const { node } = methodPath;
            if (node.key.name === 'constructor') {
              if (!node.params.some(n => t.isTSParameterProperty(n))) return;
              const types = node.params.map(n => (
                  t.isTSParameterProperty(n) &&
                  n.parameter.typeAnnotation &&
                  t.isTSTypeReference(n.parameter.typeAnnotation.typeAnnotation)
                ) ?
                n.parameter.typeAnnotation.typeAnnotation.typeName.name :
                null);

              const ctorParameters = t.classMethod(
                'method',
                t.stringLiteral('ctorParameters'),
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
                ]),
                false,
                true
              );

              nodePath.get('body').unshiftContainer('body', ctorParameters);
            }
          },
        });
      },
    },
  };
};

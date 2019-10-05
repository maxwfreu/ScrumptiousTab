import PropTypes from 'prop-types';

// from https://github.com/facebook/react/issues/1715#issuecomment-168943070
const chainablePropType = (predicate) => {
  const propType = (props, propName, componentName) => {
    // don't do any validation if empty
    if (props[propName] === null || props[propName] === undefined) {
      return null;
    }

    return predicate(props, propName, componentName);
  };

  propType.isRequired = (props, propName, componentName) => {
    // warn if empty
    if (props[propName] === null || props[propName] === undefined) {
      return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
    }

    return predicate(props, propName, componentName);
  };

  return propType;
};

const shapeWithTypeValues = (type, filterValue, props, propName, componentName) => {
  const prop = props[propName];
  if (typeof (prop) !== 'object') {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`,
    );
  }

  const propKeys = Object.keys(prop);
  const invalidKeyValuePairs = propKeys.filter(propKey => (
    filterValue(prop[propKey], propKey)
  ));
  if (invalidKeyValuePairs.length) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. \`${propName}[${invalidKeyValuePairs[0]}]\` is not a ${type}. Validation failed.`,
    );
  }

  return null;
};

const shapeWithBooleanValues = (props, propName, componentName) => {
  const filterBoolean = value => (
    typeof (value) !== 'boolean'
  );
  return shapeWithTypeValues('boolean', filterBoolean, props, propName, componentName);
};

const shapeWithStringValues = (props, propName, componentName) => {
  const filterString = value => (
    typeof (value) !== 'string'
  );
  return shapeWithTypeValues('string', filterString, props, propName, componentName);
};

const hashmapOf = (shapeValidator) => {
  if (!shapeValidator) {
    return new Error('hashmapOf Proptype must be called with a shape validator.');
  }

  const hashmapValidator = (props, propName, componentName) => {
    const filterHashmap = (hashmapValue, hashmapKey) => {
      const propTypes = {
        [`${propName}.${hashmapKey}`]: shapeValidator,
      };
      const propsToTest = {
        [`${propName}.${hashmapKey}`]: hashmapValue,
      };

      return PropTypes.checkPropTypes(propTypes, propsToTest, 'hashmap value', componentName);
    };
    return shapeWithTypeValues('hashmap', filterHashmap, props, propName, componentName);
  };

  return chainablePropType(hashmapValidator);
};

const CustomPropTypes = {
  shapeWithBooleanValues: chainablePropType(shapeWithBooleanValues),
  shapeWithStringValues: chainablePropType(shapeWithStringValues),
  hashmapOf,
};

export default CustomPropTypes;
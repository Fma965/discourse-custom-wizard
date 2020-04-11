import { ajax } from 'discourse/lib/ajax';
import EmberObject from "@ember/object";
import { buildProperties, present, mapped } from '../lib/wizard-json';
import { schema, listProperties, camelCase, snakeCase } from '../lib/wizard';
import { Promise } from "rsvp";

const CustomWizard = EmberObject.extend({
  save() {
    return new Promise((resolve, reject) => {      
      let json = this.buildJson(this, 'wizard');
      
      if (json.error) {
        reject({ error: json.error });
      }
      
      ajax("/admin/wizards/custom/save", {
        type: 'PUT',
        data: {
          wizard: JSON.stringify(json)
        }
      }).then((result) => {
        if (result.error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  },

  buildJson(object, type, result = {}) {
    let objectType = object.type || null;
    
    if (schema[type].types) {
      if (!objectType) {
        result.error = {
          type: 'required',
          params: { type, property: 'type' }
        }
        return result;
      }
    }
        
    for (let property of listProperties(type, objectType)) {
      let value = object.get(property);
      
      result = this.validateValue(property, value, object, type, result);
      
      if (result.error) {
        break;
      }
        
      if (mapped(property, type)) {
        value = this.buildMappedJson(value);
      }
            
      if (value !== undefined && value !== null) {
        result[property] = value;
      }
    };
    
    if (!result.error) {
      for (let arrayObjectType of Object.keys(schema[type].objectArrays)) {
        let arraySchema = schema[type].objectArrays[arrayObjectType];
        let objectArray = object.get(arraySchema.property);
                
        if (arraySchema.required && !present(objectArray)) {
          result.error = {
            type: 'required',
            params: { type, property: arraySchema.property }
          }
          break;
        }

        result[arraySchema.property] = [];
                
        for (let item of objectArray) {
          let itemProps = this.buildJson(item, arrayObjectType);
                    
          if (itemProps.error) {
            result.error = itemProps.error;
            break;
          } else {
            result[arraySchema.property].push(itemProps);
          }
        }
      };
    }
          
    return result;
  },
  
  validateValue(property, value, object, type, result) {
    if (schema[type].required.indexOf(property) > -1 && !value) {
      result.error = {
        type: 'required',
        params: { type, property }
      }
    }
    
    let dependent = schema[type].dependent[property];
    if (dependent && value && !object[dependent]) {
      result.error = {
        type: 'dependent',
        params: { property, dependent }
      }
    }
    
    if (property === 'api_body') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        result.error = {
          type: 'invalid',
          params: { type, property }
        }
      }
    }
    
    return result;
  },

  buildMappedJson(inputs) {
    if (!inputs || !inputs.length) return false;
    
    let result = [];
      
    inputs.forEach(inpt => {
      let input = {
        type: inpt.type,
      };
      
      if (inpt.connector) {
        input.connector = inpt.connector;
      }
          
      if (present(inpt.output)) {
        input.output = inpt.output;
        input.output_type = snakeCase(inpt.output_type);
        input.output_connector = inpt.output_connector;
      }
      
      if (present(inpt.pairs)) {
        input.pairs = [];
        
        inpt.pairs.forEach(pr => {                
          if (present(pr.key) && present(pr.value)) {
            
            let pairParams = {
              index: pr.index,
              key: pr.key,
              key_type: snakeCase(pr.key_type),
              value: pr.value,
              value_type: snakeCase(pr.value_type),
              connector: pr.connector
            }
                      
            input.pairs.push(pairParams);
          }
        });
      }
          
      if ((input.type === 'assignment' && present(input.output)) ||
          present(input.pairs)) {
        
        result.push(input);
      }
    });
    
    if (!result.length) {
      result = false;
    }
      
    return result;
  },

  remove() {
    return ajax("/admin/wizards/custom/remove", {
      type: 'DELETE',
      data: {
        id: this.get('id')
      }
    }).then(() => this.destroy());
  }
});

CustomWizard.reopenClass({
  all() {
    return ajax("/admin/wizards/custom/all", {
      type: 'GET'
    }).then(result => {
      return result.wizards.map(wizard => {
        return CustomWizard.create(wizard);
      });
    });
  },

  submissions(wizardId) {
    return ajax(`/admin/wizards/submissions/${wizardId}`, {
      type: "GET"
    }).then(result => {
      return result.submissions;
    });
  },

  create(wizardJson = {}) {
    const wizard = this._super.apply(this);
    wizard.setProperties(buildProperties(wizardJson));
    return wizard;
  }
});

export default CustomWizard;

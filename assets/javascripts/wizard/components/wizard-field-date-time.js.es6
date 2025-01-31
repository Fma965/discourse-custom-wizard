import Component from "@ember/component";
import { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  layoutName: "wizard/templates/components/wizard-field-date-time",

  @observes("dateTime")
  setValue() {
    this.set("field.value", this.dateTime.format(this.field.format));
  },

  actions: {
    onChange(value) {
      this.set("dateTime", moment(value));
    },
  },
});

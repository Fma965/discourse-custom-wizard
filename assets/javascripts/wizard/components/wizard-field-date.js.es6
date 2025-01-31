import Component from "@ember/component";
import { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  layoutName: "wizard/templates/components/wizard-field-date",

  @observes("date")
  setValue() {
    this.set("field.value", this.date.format(this.field.format));
  },

  actions: {
    onChange(value) {
      this.set("date", moment(value));
    },
  },
});

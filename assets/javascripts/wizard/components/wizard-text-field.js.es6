import computed from "discourse-common/utils/decorators";
import { isLTR, isRTL, siteDir } from "discourse/lib/text-direction";
import WizardI18n from "../lib/wizard-i18n";
import TextField from "@ember/component/text-field";

export default TextField.extend({
  attributeBindings: [
    "autocorrect",
    "autocapitalize",
    "autofocus",
    "maxLength",
    "dir",
  ],

  @computed
  dir() {
    if (this.siteSettings.support_mixed_text_direction) {
      let val = this.value;
      if (val) {
        return isRTL(val) ? "rtl" : "ltr";
      } else {
        return siteDir();
      }
    }
  },

  keyUp() {
    if (this.siteSettings.support_mixed_text_direction) {
      let val = this.value;
      if (isRTL(val)) {
        this.set("dir", "rtl");
      } else if (isLTR(val)) {
        this.set("dir", "ltr");
      } else {
        this.set("dir", siteDir());
      }
    }
  },

  @computed("placeholderKey")
  placeholder(placeholderKey) {
    return placeholderKey ? WizardI18n(placeholderKey) : "";
  },
});

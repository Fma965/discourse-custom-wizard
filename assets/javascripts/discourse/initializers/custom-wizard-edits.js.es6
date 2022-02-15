import DiscourseURL from "discourse/lib/url";
import { withPluginApi } from "discourse/lib/plugin-api";
import CustomWizardNotice from "../models/custom-wizard-notice";
import { isPresent } from "@ember/utils";
import { A } from "@ember/array";
import getUrl from "discourse-common/lib/get-url";

export default {
  name: "custom-wizard-edits",
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");

    if (!siteSettings.custom_wizard_enabled) {
      return;
    }

    const existing = DiscourseURL.routeTo;
    DiscourseURL.routeTo = function (path, opts) {
      if (path && path.indexOf("/w/") > -1) {
        return (window.location = path);
      }
      return existing.apply(this, [path, opts]);
    };

    withPluginApi("0.8.36", (api) => {
      api.modifyClass("route:admin-dashboard", {
        pluginId: "custom-wizard",

        setupController(controller) {
          this._super(...arguments);

          controller.loadCriticalNotices();
          controller.subscribe();
        },
      });

      api.modifyClass("controller:admin-dashboard", {
        pluginId: "custom-wizard",
        criticalNotices: A(),

        unsubscribe() {
          this.messageBus.unsubscribe("/custom-wizard/notices");
        },

        subscribe() {
          this.unsubscribe();
          this.messageBus.subscribe("/custom-wizard/notices", (data) => {
            if (isPresent(data.active_notice_count)) {
              this.loadCriticalNotices();
            }
          });
        },

        loadCriticalNotices() {
          CustomWizardNotice.list({
            type: ["connection_error", "warning"],
            archetype: "plugin_status",
            visible: true,
          }).then((result) => {
            if (result.notices && result.notices.length) {
              const criticalNotices = A(
                result.notices.map((n) => CustomWizardNotice.create(n))
              );
              this.set("customWizardCriticalNotices", criticalNotices);
            }
          });
        },
      });

      api.modifyClass("component:d-navigation", {
        pluginId: "custom-wizard",
        actions: {
          clickCreateTopicButton() {
            let createTopicWizard = this.get(
              "category.custom_fields.create_topic_wizard"
            );
            if (createTopicWizard) {
              window.location.href = getUrl(`/w/${createTopicWizard}`);
            } else {
              this._super();
            }
          },
        },
      });
    });
  },
};

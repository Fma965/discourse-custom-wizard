import { get, set } from "@ember/object";
import { getOwner } from "discourse-common/lib/get-owner";

const wizard = {
  basic: {
    id: null,
    name: null,
    background: null,
    save_submissions: true,
    multiple_submissions: null,
    after_signup: null,
    after_time: null,
    after_time_scheduled: null,
    required: null,
    prompt_completion: null,
    restart_on_revisit: null,
    resume_on_revisit: null,
    theme_id: null,
    permitted: null,
  },
  mapped: ["permitted"],
  required: ["id"],
  dependent: {
    after_time: "after_time_scheduled",
  },
  objectArrays: {
    step: {
      property: "steps",
      required: false,
    },
    action: {
      property: "actions",
      required: false,
    },
  },
};

const step = {
  basic: {
    id: null,
    index: null,
    title: null,
    banner: null,
    raw_description: null,
    required_data: null,
    required_data_message: null,
    permitted_params: null,
    condition: null,
    force_final: false,
  },
  mapped: ["required_data", "permitted_params", "condition", "index"],
  required: ["id"],
  dependent: {},
  objectArrays: {
    field: {
      property: "fields",
      required: false,
    },
  },
};

const field = {
  basic: {
    id: null,
    index: null,
    label: null,
    image: null,
    description: null,
    property: null,
    required: null,
    type: null,
    condition: null,
  },
  types: {},
  mapped: ["prefill", "content", "condition", "index"],
  required: ["id", "type"],
  dependent: {},
  objectArrays: {},
};

const action = {
  basic: {
    id: null,
    run_after: "wizard_completion",
    type: null,
  },
  types: {
    create_topic: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      category: null,
      tags: null,
      visible: null,
      custom_fields: null,
      skip_redirect: null,
      suppress_notifications: null,
    },
    send_message: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      skip_redirect: null,
      custom_fields: null,
      required: null,
      recipient: null,
      suppress_notifications: null,
    },
    open_composer: {
      title: null,
      post: null,
      post_builder: null,
      post_template: null,
      category: null,
      tags: null,
      custom_fields: null,
    },
    update_profile: {
      profile_updates: null,
      custom_fields: null,
    },
    watch_categories: {
      categories: null,
      notification_level: null,
      mute_remainder: null,
      wizard_user: true,
      usernames: null,
    },
    send_to_api: {
      api: null,
      api_endpoint: null,
      api_body: null,
    },
    add_to_group: {
      group: null,
    },
    route_to: {
      url: null,
      code: null,
    },
    create_category: {
      name: null,
      slug: null,
      color: null,
      text_color: "FFFFFF",
      parent_category_id: null,
      permissions: null,
      custom_fields: null,
    },
    create_group: {
      name: null,
      full_name: null,
      title: null,
      bio_raw: null,
      owner_usernames: null,
      usernames: null,
      grant_trust_level: null,
      mentionable_level: null,
      messageable_level: null,
      visibility_level: null,
      members_visibility_level: null,
      custom_fields: null,
    },
  },
  mapped: [
    "title",
    "category",
    "tags",
    "visible",
    "custom_fields",
    "required",
    "recipient",
    "profile_updates",
    "group",
    "url",
    "categories",
    "mute_remainder",
    "name",
    "slug",
    "color",
    "text_color",
    "parent_category_id",
    "permissions",
    "full_name",
    "bio_raw",
    "owner_usernames",
    "usernames",
    "grant_trust_level",
    "mentionable_level",
    "messageable_level",
    "visibility_level",
    "members_visibility_level",
  ],
  required: ["id", "type"],
  dependent: {},
  objectArrays: {},
};

const custom_field = {
  klass: ["topic", "post", "group", "category"],
  type: ["string", "boolean", "integer", "json"],
};

const wizardSchema = {
  wizard,
  step,
  field,
  custom_field,
  action
};

export function hasRequiredSubscription(currentSubscriptionType, featureSubscriptionType) {
  const types = wizardSchema.subscription.types;
  return types.indexOf(currentSubscriptionType) >= types.indexOf(featureSubscriptionType);
}

export function subscriptionType(feature, attribute, value) {
  let attributes =  wizardSchema.subscription.features[feature];

  if (!attributes || !attributes[attribute] || !attributes[attribute][value]) {
    return wizardSchema.subscription_types[0];
  } else {
    return attributes[attribute][value];
  }
}

export function buildSchema(model) {
  wizardSchema.subscription = {};
  wizardSchema.subscription.features = model.subscription_features;
  wizardSchema.subscription.types = model.subscription_types;
  wizardSchema.field.types = model.field_types;
  wizardSchema.field.validations = model.realtime_validations;
}

const siteSettings = getOwner(this).lookup("site-settings:main");
if (siteSettings.wizard_apis_enabled) {
  wizardSchema.action.types.send_to_api = {
    api: null,
    api_endpoint: null,
    api_body: null,
  };
}

export function setWizardDefaults(obj, itemType) {
  const objSchema = wizardSchema[itemType];
  const basicDefaults = objSchema.basic;

  Object.keys(basicDefaults).forEach((property) => {
    let defaultValue = get(basicDefaults, property);
    if (defaultValue) {
      set(obj, property, defaultValue);
    }
  });

  if (objSchema.types) {
    const typeDefaults = objSchema.types[obj.type];

    if (typeDefaults) {
      Object.keys(typeDefaults).forEach((property) => {
        if (typeDefaults.hasOwnProperty(property)) {
          set(obj, property, get(typeDefaults, property));
        }
      });
    }
  }

  return obj;
}

export default wizardSchema;

import * as yup from "yup";

// https://github.com/jquense/yup

const translateType = (type: string) => {
  switch (type) {
    case "number":
      return "nummer";
    case "string":
      return "sträng";
    case "email":
      return "e-post";
    default:
      return type;
  }
};

// Only client side gets the translation, based on: https://github.com/jquense/yup/blob/2973d0a/src/locale.js
// @ts-ignore
if (typeof window !== "undefined") {
  yup.setLocale({
    mixed: {
      required: "Obligatorisk",
      notType({ type }) {
        return `Fel typ, måste vara ${translateType(type)}`;
      },
    },
    string: {
      min: "Minst ${min} tecken behövs",
      length: "Måste vara ${length} tecken långt",
      email: "Måste vara en giltig e-post adress",
    },
  });
}

const isProd = process.env.NODE_ENV === "production"

export const configSchema = yup.object({
  ENDPOINT: yup.string().required(),
  USERNAME: yup.string().required(),
  PASSWORD: yup.string().required(),
  HTTPS_SSL_CERT: isProd ? yup.string().required() : yup.string().optional(),
  HTTPS_SSL_KEY: isProd ? yup.string().required() : yup.string().optional()
});

const phoneRegExp =
  /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

export const formSchema = yup.object({
  name: yup.string().length(0),
  email: yup.string().length(0),
  caller: yup.string().required(),
  user_name: yup.string(),
  u_place_of_work: yup.string().required(),
  u_alternativ_kontaktvag: yup
    .string()
    .matches(phoneRegExp, "Måste vara ett telefonnummer")
    .required(),
  u_additional_e_mail_address: yup.string().email().required(),
  other: yup.string().oneOf(["true", "false"]).required(),
  u_opened_for: yup.string().when("other", {
    is: (val: "true" | "false") => val === "true",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  user_name_2: yup.string().when("other", {
    is: (val: "true" | "false") => val === "true",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  u_place_of_work_2: yup.string().when("other", {
    is: (val: "true" | "false") => val === "true",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  call_type: yup.string().oneOf(["sc_request", "incident"]).required(),
  short_description: yup.string().required(),
  description: yup.string().min(20).required(),
  u_confidential_information: yup.string(),
  files: yup.array(
    yup.object({
      name: yup.string(),
      type: yup.string(),
      data: yup.string(),
    })
  ),
  incident_date: yup.string().when("call_type", {
    is: (val: "incident" | "sc_request") => val === "incident",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  incident_other_computer: yup.string().when("call_type", {
    is: (val: "incident" | "sc_request") => val === "incident",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  incident_other_people: yup.string().when("call_type", {
    is: (val: "incident" | "sc_request") => val === "incident",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  incident_other_system: yup.string().when("call_type", {
    is: (val: "incident" | "sc_request") => val === "incident",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
});

export type FormValues = Omit<
  yup.InferType<typeof formSchema>,
  "name" | "email"
>;

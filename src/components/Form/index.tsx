import {
  ArrowForwardIcon,
  AttachmentIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Collapse,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Link,
  Select,
  Spacer,
  StackDivider,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import { convertFileToBase64 } from "src/lib/file/convertFileToBase64";
import { formSchema, FormValues } from "src/lib/schema";
import { IResult } from "src/lib/TellusAPI";
import { PhoneModal } from "../Modal/PhoneModal";
import { FormField } from "./FormField";

export const FormLayout = () => {
  const attachmentRef = useRef(null);
  const [recordNumber, setRecordNumber] = useState("");
  const {
    isOpen: isFormSubmitted,
    onOpen: showFormSubmitted,
    onClose: hideFormSubmitted,
  } = useDisclosure();

  const {
    isOpen: isSubmitError,
    onOpen: showSubmitError,
    onClose: hideSubmitError,
  } = useDisclosure();

  const {
    isOpen: isPhoneModalOpen,
    onOpen: showPhoneModal,
    onClose: hidePhoneModal,
  } = useDisclosure();

  const {
    isOpen: isAddedToQueue,
    onOpen: showIsAddedToQueue,
    onClose: hideIsAddedToQueue,
  } = useDisclosure();

  // If you want to change required fields, change the formSchema instead, src/lib/schema, try to use it as a single source
  return (
    <Formik<FormValues>
      initialValues={{
        caller: "",
        user_name: "",
        u_place_of_work: "",
        u_alternativ_kontaktvag: undefined,
        u_additional_e_mail_address: "",
        call_type: "sc_request",
        short_description: "",
        description: "",
        u_confidential_information: "",
        files: [],
        incident_date: "",
        incident_other_people: "",
        incident_other_computer: "",
        incident_other_system: "",
        other: "false",
        u_opened_for: "",
        user_name_2: "",
        u_place_of_work_2: "",
      }}
      validationSchema={formSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const tempDesc = values.description;
        try {
          // Hide alerts
          hideFormSubmitted();
          hideSubmitError();
          hideIsAddedToQueue();

          if (values.call_type === "incident") {
            values.description += `\nNär fungerade det senast?: ${values.incident_date}\nHar andra samma fel?: ${values.incident_other_people}\nFungerar det på en annan dator/enhet?: ${values.incident_other_computer}\nHar du samtidigt fel i andra system/tjänster?: ${values.incident_other_system}`;
          }
          const { data } = await axios.post<IResult>("/api", values);
          setRecordNumber(data.result.number);
          showFormSubmitted();
          resetForm();
        } catch (error) {
          if (error instanceof AxiosError) {
            if (
              error.response.status === 500 &&
              error.response.data.message === "Added to queue"
            ) {
              // show added to queue msg
              showIsAddedToQueue();
            }
          } else {
            showSubmitError();
          }
        }

        values.description = tempDesc;
        setSubmitting(false);
      }}
    >
      {(props) => {
        return (
          <Form>
            {isFormSubmitted && (
              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
                pb="4"
              >
                <Alert status="success">
                  <AlertIcon />
                  <AlertDescription>
                    Tack för ditt ärende!
                    {recordNumber &&
                      ` Du har fått ärendenummer: ${recordNumber}`}{" "}
                  </AlertDescription>
                </Alert>
              </GridItem>
            )}

            {isSubmitError && (
              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
                pb="4"
              >
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>
                    Något gick fel försök igen senare
                  </AlertDescription>
                </Alert>
              </GridItem>
            )}

            {isAddedToQueue && (
              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
                pb="4"
              >
                <Alert status="warning">
                  <AlertIcon />
                  <AlertDescription>
                    Ditt har ärende har lagts i kö och så fort TellUs är uppe
                    igen så skickas det in.
                  </AlertDescription>
                </Alert>
              </GridItem>
            )}

            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
              gap={3}
            >
              {/* <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
              >
                <Text fontSize={"lg"}>Kontaktuppgifter</Text>

                <hr />
              </GridItem> */}
              <GridItem>
                <FormField name="caller" label="Namn" as={Input} />
              </GridItem>
              <GridItem>
                <FormField name="user_name" label="HSA-ID" as={Input} />
              </GridItem>
              <GridItem>
                <FormField
                  name="u_place_of_work"
                  label="Arbetsplats"
                  as={Input}
                />
              </GridItem>
              <GridItem>
                <FormField
                  name="u_alternativ_kontaktvag"
                  label="Telefonnummer"
                  as={Input}
                />
              </GridItem>
              <GridItem>
                <FormField
                  name="u_additional_e_mail_address"
                  label="E-post"
                  as={Input}
                />
              </GridItem>
              <Spacer
                display={{
                  base: "none",
                  md: "initial",
                }}
              />
              <GridItem>
                <FormField
                  label="Beställer du åt någon annan?"
                  name="other"
                  as={Select}
                >
                  <option value="false">Nej</option>
                  <option value="true">Ja</option>
                </FormField>
              </GridItem>
              <Spacer
                display={{
                  base: "none",
                  md: "initial",
                }}
              />
              {props.values.other === "true" && (
                <>
                  <GridItem>
                    <FormField name="u_opened_for" label="Namn" as={Input} />
                  </GridItem>
                  <GridItem>
                    <FormField name="user_name_2" label="HSA-ID" as={Input} />
                  </GridItem>
                  <GridItem>
                    <FormField
                      name="u_place_of_work_2"
                      label="Arbetsplats"
                      as={Input}
                    />
                  </GridItem>
                </>
              )}
              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
              >
                {/* <Text fontSize={"lg"}>Ärendeinformation</Text> */}
                <hr />
              </GridItem>

              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
                display={
                  props.values.call_type === "incident" ? "initial" : "none"
                }
              >
                <Collapse in={props.values.call_type === "incident"}>
                  <Link onClick={showPhoneModal}>
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription>
                        Om ditt ärende är brådskande ber vid dig att kontakta
                        oss via telefon, klicka här
                      </AlertDescription>
                    </Alert>
                  </Link>
                </Collapse>
                <PhoneModal
                  isOpen={isPhoneModalOpen}
                  onClose={hidePhoneModal}
                />
              </GridItem>

              <GridItem>
                <FormField label="Typ av ärende" name="call_type" as={Select}>
                  <option value="sc_request">Fråga / Beställning</option>
                  <option value="incident">Felanmälan</option>
                </FormField>
              </GridItem>
              <Spacer />
              <GridItem>
                <FormField
                  name="short_description"
                  label="Rubrik"
                  as={Input}
                  placeholder="Kort beskrivning av ditt ärende"
                />
              </GridItem>
              <GridItem>
                <FormField
                  name="u_confidential_information"
                  label="Konfidentiell information"
                  as={Input}
                  helpertext="IP-adresser, Servernamn eller eTjänstekortnummer"
                />
              </GridItem>
              <GridItem
                colSpan={{
                  base: 1,
                  md: 2,
                }}
              >
                <FormField
                  name="description"
                  label="Beskrivning"
                  as={Textarea}
                  placeholder="Beskriv ditt ärende så utförligt du kan"
                />
              </GridItem>
              {props.values.call_type === "incident" && (
                <>
                  <GridItem>
                    <FormField
                      name="incident_date"
                      label="När fungerade det senast"
                      type="date"
                      as={Input}
                    />
                  </GridItem>
                  <GridItem>
                    <FormField
                      name="incident_other_people"
                      label="Har andra samma fel?"
                      as={Select}
                    >
                      <option disabled value="">
                        Välj
                      </option>
                      <option value="Ja">Ja</option>
                      <option value="Nej">Nej</option>
                      <option value="Vet ej">Vet ej</option>
                    </FormField>
                  </GridItem>
                  <GridItem>
                    <FormField
                      name="incident_other_computer"
                      label="Fungerar det på en annan dator/enhet?"
                      as={Select}
                    >
                      <option disabled value="">
                        Välj
                      </option>
                      <option value="Ja">Ja</option>
                      <option value="Nej">Nej</option>
                      <option value="Vet ej">Vet ej</option>
                    </FormField>
                  </GridItem>
                  <GridItem>
                    <FormField
                      name="incident_other_system"
                      label="Har du samtidigt fel i andra system/tjänster?"
                      as={Select}
                    >
                      <option disabled value="">
                        Välj
                      </option>
                      <option value="Ja">Ja</option>
                      <option value="Nej">Nej</option>
                      <option value="Vet ej">Vet ej</option>
                    </FormField>
                  </GridItem>
                </>
              )}

              <GridItem
                display={"flex"}
                flexDir="column"
                colSpan={{
                  base: 1,
                  md: 2,
                }}
                gap="4"
              >
                <input
                  ref={attachmentRef}
                  name="files"
                  type="file"
                  style={{ display: "none" }}
                  multiple
                  onChange={async (e) => {
                    const map = await Promise.all(
                      Array.from(e.target.files).map(async (file) => ({
                        name: file.name,
                        type: file.type,
                        data: (await convertFileToBase64(file))
                          .split(";base64,")
                          .pop(),
                      }))
                    );
                    props.setFieldValue("files", map);
                    e.target.value = "";
                  }}
                />

                <Flex justify={"space-between"}>
                  <Button
                    w="40"
                    leftIcon={<AttachmentIcon />}
                    variant="outline"
                    onClick={() => attachmentRef.current.click()}
                  >
                    Bifoga
                  </Button>
                  <Button
                    w="40"
                    rightIcon={<ArrowForwardIcon />}
                    colorScheme="blue"
                    isLoading={props.isSubmitting}
                    type="submit"
                    onClick={(e) => {
                      if (props.values.other === "true") {
                        // here we need to swap places for the users fields, because reasons...
                        let temp = { ...props.values };

                        temp.u_opened_for = props.values.caller;
                        temp.user_name_2 = props.values.user_name;
                        temp.u_place_of_work_2 = props.values.u_place_of_work;

                        temp.caller = props.values.u_opened_for;
                        temp.user_name = props.values.user_name_2;
                        temp.u_place_of_work = props.values.u_place_of_work_2;

                        props.setValues(temp);
                      } else {
                        // Clear other fields for saftey
                        props.setFieldValue("u_opened_for", "");
                        props.setFieldValue("user_name_2", "");
                        props.setFieldValue("u_place_of_work_2", "");
                      }
                      props.handleSubmit();
                    }}
                  >
                    Skicka
                  </Button>
                </Flex>

                {props.values.files.length > 0 && (
                  <VStack
                    border="1px"
                    borderColor="inherit"
                    rounded="lg"
                    divider={<StackDivider borderColor="inherit" />}
                  >
                    {props.values.files.map((file) => (
                      <Flex
                        justify="space-between"
                        align="center"
                        w="full"
                        py="4"
                        px="6"
                        key={file.name}
                      >
                        <Flex align="center" gap="4">
                          <AttachmentIcon w={5} h={5} />
                          {file.name}
                        </Flex>

                        <IconButton
                          aria-label={`remove attachment ${file.name}`}
                          colorScheme={"red"}
                          icon={<SmallCloseIcon />}
                          onClick={() => {
                            props.setFieldValue(
                              "files",
                              props.values.files.filter(
                                ({ name }) => name !== file.name
                              )
                            );
                          }}
                        />
                      </Flex>
                    ))}
                  </VStack>
                )}
              </GridItem>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

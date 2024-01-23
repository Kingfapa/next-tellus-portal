import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  Container,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FormLayout } from "src/components/Form";
import Header from "src/components/Header";
import { IAlertsApiResponse } from "./api/alerts";

export interface IAlertProps {
  alertType: AlertStatus;
  title: string;
  description: string;
}

const Index = () => {
  const [alerts, setAlerts] = useState<IAlertProps[]>([]);

  useEffect(() => {
    const getAlerts = async () => {
      const response = await fetch("/api/alerts");
      setAlerts(((await response.json()) as IAlertsApiResponse).records);
    };

    getAlerts();
  }, []);
  return (
    <>
      <Header />
      <Head>
        <title>Kontaktformulär</title>
      </Head>
      {/* PageAlerts */}
      {alerts &&
        alerts.map((alert, idx) => (
          <Alert key={idx} status={alert.alertType}>
            <AlertIcon />
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            {alert.description && (
              <AlertDescription>{alert.description}</AlertDescription>
            )}
          </Alert>
        ))}

      <Container
        shadow={"lg"}
        my={{
          base: "0",
          md: "6",
        }}
        maxW="container.md"
        p="6"
        borderWidth={{
          base: "none",
          md: "1px",
        }}
      >
        <FormLayout />
      </Container>
    </>
  );
};

export default Index;

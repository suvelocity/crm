import React from "react";
import { IEvent } from "../../typescript/interfaces";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatToIsraeliDate } from "../../helpers";

export default function PDFLink({ data }: { data: IEvent[] }) {
  console.log(data);

  const MyDocument = () => (
    <Document>
      <Page size='A4'>
        <View>
          {data.map((process: IEvent, i: number) => (
            <Text>
              {i + 1}. Student: {process.Student!.firstName}{" "}
              {process.Student!.lastName}, Position: {process.Job!.position},
              Status: {process.status}, Date:
              {formatToIsraeliDate(process.date)}.
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <PDFDownloadLink
        document={<MyDocument />}
        fileName={`processes-list-${formatToIsraeliDate(
          new Date().toString()
        )}.pdf`}
      >
        {
          //@ts-ignore
          ({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
    </div>
  );
}

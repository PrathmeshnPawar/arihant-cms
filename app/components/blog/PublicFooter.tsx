"use client";

import Link from "next/link";
import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";


const links = {
  "More About Arihant": [
    { label: "Equity", href: "#" },
    { label: "Mutual Funds", href: "#" },
    { label: "NPS", href: "#" },
    { label: "Fixed Income", href: "#" },
    { label: "Trading Platforms", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Work With Arihant", href: "#" },
    { label: "Media Center", href: "#" },
  ],
  "Useful Links": [
    { label: "Open an account", href: "#" },
    { label: "Help", href: "#" },
    { label: "Partner With Us", href: "#" },
  ],
};

export default function PublicFooter() {
  return (
    <Box sx={{ bgcolor: "#0b1220", color: "#fff", mt: 6 }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {Object.entries(links).map(([title, items]) => (
            <Grid key={title} size={{ xs: 12, sm: 4 }}>
              <Typography fontWeight={900} sx={{ mb: 1.5 }}>
                {title}
              </Typography>

              <Stack spacing={1}>
                {items.map((it) => (
                  <Typography
                    key={it.label}
                    component={Link}
                    href={it.href}
                    sx={{
                      color: "rgba(255,255,255,0.75)",
                      textDecoration: "none",
                      fontSize: 14,
                      "&:hover": { color: "#fff" },
                    }}
                  >
                    {it.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

        <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", mb: 1.5 }}>
          #1011 Solitaire Corporate Park, Andheri Ghatkopar Link Road, Chakala, Andheri (E), Mumbai – 4000093.
        </Typography>

        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", mb: 1.5 }}>
          <b>Investor Alert :-</b> conducting appropriate analysis of respective companies and not to blindly follow
          unfounded rumors, tips etc. Further, you are also requested to share your knowledge or evidence of systemic
          wrongdoing, potential frauds or unethical behaviour through the anonymous portal facility provided on BSE & NSE
          website.
        </Typography>

        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", mb: 1.5 }}>
          <b>ATTENTION INVESTORS :-</b> 1) KYC is one time exercise while dealing in securities markets – once KYC is done
          through a SEBI registered intermediary (Broker, DP, Mutual Fund etc.), you need not undergo the same process
          again when you approach another intermediary. 2) Prevent unauthorised transactions in your account – update your
          mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from
          Exchange on your mobile/email at the end of the day… 3) Prevent Unauthorized Transactions in your demat account
          – update your mobile number with DP, receive alerts on registered mobile for debit and other important
          transactions… 4) No need to issue cheques while subscribing to IPO… 5) Investors should be cautious on
          unsolicited emails/SMS advising to buy/sell/hold securities.
        </Typography>

        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", mb: 1.5 }}>
          Arihant group companies are registered broker and dealer. SEBI Registration number for NSE & BSE :- INZ000180939;
          NSDL – IN-DP-127-2015 DP ID-IN301983; CDSL DP ID-43000; NCDEX – 00080; MCX – 10525; AMFI – ARN 15114; SEBI
          Merchant Banking Regn. No. – MB INM 000011070; SEBI Research Analyst Regn. No. – INH000002764. Existing customers
          can send grievances to <b>compliance@arihantcapital.com</b>. DP queries/Complaints:{" "}
          <b>depository@arihantcapital.com</b>.
        </Typography>

        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", mb: 1.5 }}>
          <b>ARIHANT CAPITAL IFSC LIMITED</b> | SEBI Regid. No. : INZ000157539 <br />
          Address: Unit No. 424, 4th Floor, The Signature Building, Block 13B, Road 1C, Zone 1, GIFT SEZ, GIFT City,
          Gandhinagar, Gujarat – 382355. | Tel: 079-40701700
        </Typography>

        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>
          Disclaimer: Arihant Capital Markets Limited and Arihant Futures & Commodities Limited are engaged in client based
          and proprietary trading on various stock and commodity exchanges. Arihant Capital IFSC Limited is engaged in
          proprietary trading in NSE IFSC Stock Exchange and India INX Stock Exchange.
        </Typography>
      </Container>

      <Box sx={{ py: 2, bgcolor: "#060a14" }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} Arihant Capital. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

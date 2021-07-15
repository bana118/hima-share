type headersType = {
  cc: string;
  bcc: string;
  subject: string;
  body: string;
};

type ObfuscateProps = {
  email?: string | null;
  headers?: headersType | null;
  tel?: string | null;
  sms?: string | null;
  facetime?: string | null;
  href?: string | null;
  linkText?: string;
  obfuscate?: boolean;
  obfuscateChildren?: boolean;
  element?: string;
  onClick?: function;
};

export default function Obfuscate({
  email = null,
  headers = null,
  tel = null,
  sms = null,
  facetime = null,
  href = null,
  linkText = "obfuscated",
  obfuscate = true,
  obfuscateChildren = true,
  element = "a",
  onClick = null,
}: ObfuscateProps): JSX.Element;

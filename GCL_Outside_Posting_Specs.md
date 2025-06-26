# GulfCoastLeads Outside Posts – XML Response

The customer **must** still be on your site when you redirect them to GulfCoastLeads (GCL). GCL returns a *Redirect URL* that you must immediately forward the consumer to.  
Take measures to ensure the consumer can submit **only once**.

---

## Posting URL

```
https://www.submitlead.com/cash/1.6/
```

---

## Tracking Variables (all required)

| Field      | Description                    |
|------------|--------------------------------|
| **SourceID*** | Value provided by GCL |
| **Partner***  | Value provided by GCL |

---

## Required Customer Information

<details>
<summary>Click to view the full field list</summary>

| Field | Description / Allowed Values |
|-------|-----------------------------|
| **AID** | Your affiliate code (varchar 128) |
| **CUSTGENDER*** | `M` or `F` |
| **CUSTFNAME*** | First name |
| **CUSTLNAME*** | Last name |
| **CUSTZIP*** | 5-digit ZIP |
| **CUSTCITY*** | City |
| **CUSTSTATE** | State |
| **CUSTHOMEPHONE*** | `1234567890` |
| **CUSTEMAIL*** | Email address |
| **HOWPAID*** | `DC` – Direct-deposit Checking<br>`DS` – Direct-deposit Savings<br>`PC` – Paper check to Checking<br>`PS` – Paper check to Savings |
| **CUSTBANKNAME*** | Bank name |
| **CUSTABANO*** | ABA / routing number |
| **CUSTACCTNO*** | Bank account number |
| **TIMEATBANK*** | `1` = 0 y 3 m<br>`2` = 0 y 6 m<br>`3` = 1 y<br>`4` = 2 y<br>`5` = 3 y + |
| **LOANAMOUNT*** | 100 – 1000 (step 100) |
| **CUSTSSN*** | SSN, no dashes |
| **CUSTADD1*** | Street address |
| **TIMEATRESIDENCE*** | Same scale as **TIMEATBANK** |
| **CUSTMOBILEPHONE** | `1234567890` |
| **HOMESTATUS*** | `Rent` or `Own` |
| **CUSTDLNO*** | Driver’s-license # |
| **CUSTDLSTATE*** | DL state |
| **CUSTDOB*** | `MM/DD/YYYY` |
| **EMPNAME*** | Employer name |
| **ACTIVE_MILITARY*** | `1` yes, `0` no |
| **TIMEATJOB*** | Same scale as **TIMEATBANK** |
| **CUSTWORKPHONE*** | `1234567890` |
| **EMPADD1** | Employer street |
| **EMPZIP** | Employer ZIP |
| **AVGSALARY*** | **Gross** last paycheck amount |
| **PERIODICITY*** | `W` Weekly, `B` Bi-Weekly,<br>`S` Semi-Monthly, `M` Monthly |
| **CUSTCONTACTTIME** | `AM`, `NN`, `PM` |
| **TYPEOFINCOME*** | `P` Employed, `G` Social Security,<br>`M` Military, `W` Welfare,<br>`D` Disability, `S` Pension,<br>`L` Self-employed, `U` Unemployment |
| **NEXTPAYDATE*** | `MM/DD/YYYY` |
| **REFFNAME / LNAME / RELATION / HOMEPHONE** | Reference 1 (phone `1234567890`) |
| **REFFNAME2 / …** | Reference 2 |
| **WEBSITENAME*** | e.g. `www.application.com` |
| **IP*** | Applicant IP address |
| **EMAIL_OPTIN*** | `1` yes, `0` no |
| **USER_AGENT*** | HTTP user-agent string |
| **TITLE_OPTION** | `1` yes, `0` no – applicant owns a vehicle & is interested in a title loan |

**References:** If not collected, send `'Not Collected'` for names/relationship and `0000000000` for phones, or omit the fields entirely.
</details>

---

## Sample GET (Use **POST** in production)

```
https://www.submitlead.com/cash/1.6/?SourceID=[…]&Partner=[…]&AID=[…]&CUSTGENDER=M&CUSTFNAME=Test&CUSTLNAME=McTester&CUSTZIP=33333&CUSTHOMEPHONE=4043570000&CUSTEMAIL=mctst@mctster.com&HOWPAID=DC&CUSTBANKNAME=Chase&CUSTABANO=123123123&CUSTACCTNO=123123123&TIMEATBANK=1&LOANAMOUNT=100&CUSTSSN=123456789&CUSTADD1=123%20Main%20Street&TIMEATRESIDENCE=1&CUSTMOBILEPHONE=8882220000&HOMESTATUS=Own&CUSTDLNO=12345678&CUSTDLSTATE=TX&CUSTDOB=05/14/1965&EMPNAME=TestCompany&ACTIVE_MILITARY=0&TIMEATJOB=3&CUSTWORKPHONE=8885550000&EMPADD1=123%20Test%20St.&EMPZIP=33333&AVGSALARY=1900&PERIODICITY=B&CUSTCONTACTTIME=NN&TYPEOFINCOME=P&NEXTPAYDATE=10/14/2007&REFFNAME=Test&REFLNAME=Test&REFRELATION=Friend&REFHOMEPHONE=8885551111&REFFNAME2=Test2&REFLNAME2=Test2&REFRELATION2=Friend&REFHOMEPHONE2=8885552222&IP=192.168.0.100&WEBSITENAME=www.testsite.com&EMAIL_OPTIN=1&USER_AGENT=Mozilla/5.0%20(Windows%20NT%2010.0;%20WOW64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/56.0.2924.87%20Safari/537.36&TITLE_OPTION=0
```

---

## Possible Responses

### Accepted

```xml
<GulfCoastLeadsResponse>
  <Result>ACCEPTED:</Result>
  <RedirectURL><![CDATA[http://www.redirecturl.com?auth=123]]></RedirectURL>
  <Price>7.50</Price>
</GulfCoastLeadsResponse>
```

### Rejected

```xml
<GulfCoastLeadsResponse>
  <Result>REJECTED:</Result>
  <Message>Rejection Reason or Error Message</Message>
</GulfCoastLeadsResponse>
```

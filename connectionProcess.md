# Bank Account Data Integration - Quickstart Guide

This guide outlines the key steps to integrate with the Bank Account Data API.

---

## **Step 1: Get Access Token**
Request an access token using your secret credentials.

### Request:
```bash
curl -X POST "https://bankaccountdata.gocardless.com/api/v2/token/new/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"secret_id":"string", "secret_key":"string"}'
```

### Response:
```json
{
  "access": "string",
  "access_expires": 86400,
  "refresh": "string",
  "refresh_expires": 2592000
}
```

---

## **Step 2: Choose a Bank**
Fetch a list of available banks and their IDs.

### Request:
```bash
curl -X GET "https://bankaccountdata.gocardless.com/api/v2/institutions/?country=gb" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Response:
```json
[
  {
    "id": "REVOLUT_REVOGB21",
    "name": "Revolut",
    "logo": "https://cdn-logos.gocardless.com/ais/REVOLUT_REVOGB21.png"
  }
]
```

---

## **Step 3: Create an End User Agreement**
Define the scope and duration of access for user data.

### Request:
```bash
curl -X POST "https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"institution_id": "REVOLUT_REVOGB21", "max_historical_days": 180}'
```

### Response:
```json
{
  "id": "agreement-id",
  "max_historical_days": 180,
  "institution_id": "REVOLUT_REVOGB21"
}
```

---

## **Step 4: Build a Link**
Create a requisition to generate the authentication link.

### Request:
```bash
curl -X POST "https://bankaccountdata.gocardless.com/api/v2/requisitions/" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"redirect": "http://www.yourwebpage.com", "institution_id": "REVOLUT_REVOGB21"}'
```

### Response:
```json
{
  "id": "requisition-id",
  "link": "https://ob.gocardless.com/psd2/start/requisition-id/REVOLUT_REVOGB21"
}
```

---

## **Step 5: List Accounts**
After user authentication, retrieve their accounts using the requisition ID.

### Request:
```bash
curl -X GET "https://bankaccountdata.gocardless.com/api/v2/requisitions/requisition-id/" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Response:
```json
{
  "accounts": ["account-id-1", "account-id-2"]
}
```

---

## **Step 6: Access Transactions**
Fetch transaction data for a specific account.

### Request:
```bash
curl -X GET "https://bankaccountdata.gocardless.com/api/v2/accounts/account-id-1/transactions/" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Response:
```json
{
  "transactions": {
    "booked": [
      {
        "transactionAmount": { "currency": "EUR", "amount": "45.00" },
        "bookingDate": "2020-10-30"
      }
    ]
  }
}
```

---

## **Summary**
1. **Generate Access Token**: Authenticate with secrets.
2. **Choose Bank**: Select a financial institution.
3. **End User Agreement**: Define data access terms.
4. **Create Link**: Generate a user authentication link.
5. **List Accounts**: Retrieve authenticated accounts.
6. **Access Transactions**: Fetch account details and transactions.

# 📝 Invoices — Remote Application (Billing)

The **Invoices** microfrontend is part of the **Billing** application group.  
It is built with [React](https://react.dev/) and [Rsbuild](https://modernjs.dev/rsbuild) using [Module Federation](https://module-federation.io/).

This module integrates into the **Chrome Host application** and provides UI and functionality to get and edit invoices info.

---

## 🚀 Overview

The **Invoices App** consumes shared components, hooks, and utilities exposed by the **Chrome Host Application**.

### 🔧 Features available for operators
- 🧾 **Automated invoice generation** — invoices are automatically created for the operator’s customers based on their monthly resource consumption.
- 📋 I**nvoice management** — the Invoices tab displays a list of invoices for all customers within the operator’s regional location. Invoices are updated hourly.
- ✏️ **Invoice editing** — users can edit invoices that are automatically generated each month.
- 🔄 **Automated status transitions** — invoices automatically move between four possible statuses:
  - Draft → automatically changes to Unpaid on the second day of the following month.
  - Unpaid → automatically changes to Paid when payment is confirmed.
  - Unpaid → Post Due — if payment is not made before the due date, the status automatically changes to Post Due.
  - Manual override — users can manually set an invoice to Post Due if necessary.
- ⏱️ **Real-time updates** — invoice data is refreshed automatically every hour to ensure accuracy.
- 🔗 **Shared UI and logic** imported from the Host app
- 🧩 **Microfrontend integration** using Module Federation

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [React 18+](https://react.dev/) |
| Bundler | [Rsbuild](https://modernjs.dev/rsbuild) |
| Microfrontends | [Module Federation](https://module-federation.io/) |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) *(imported from Host)* |
| Forms | [react-hook-form](https://react-hook-form.com/) *(via Host hooks)* |
| Validation | [Zod](https://zod.dev/) *(via Host hooks)* |
| Global State | [Redux](https://redux.js.org/) *(via Host store)* |

---

## ⚠️ Important Note

> **This remote application cannot run independently.**  
> It must always be loaded and executed within the **Chrome Host application** context.  
> The Host provides authentication, global routing, shared UI components, and state management — all of which are required for Invoices to function properly.

---

## ⚙️ Installation & Local Development

### 1. Clone the repository

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Before starting the app, you need to create a local environment file.
Copy the example file:

```bash
cp .env.example .env.local
```
Open .env.local and provide valid values for all keys (API endpoints, etc.).

### 4. Start the development server
```bash
npm run dev
```

The app will be available at:
http://localhost:8033

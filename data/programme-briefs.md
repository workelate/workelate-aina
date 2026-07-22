# Programme briefs — drafted from code, awaiting founder confirmation

Drafted 2026-07-23 by reading the repository trees, `package.json`
dependencies and the model/route/screen filenames of 38 repositories via the
GitHub API. **Nothing here is on the site.**

Each brief separates two things, deliberately:

- **Evidence** — what is literally in the repository. Checkable.
- **Reads as** — my inference about what the product was for. This is an
  estimate from structure, not something a client told me. Correct it.

**Founder to fill:** the `Outcome` line (what it moved, for whom) and `Name?`
(`YES` = we may name the client publicly, `NDA` = anonymised descriptor only).
No brief ships until both are answered.

---

## 1. Property developer — customer & construction-tracking app
**Repos:** `myPiramal` (React Native, 242 files), `Piramal` (55 files), plus iOS/native variants · 5 repos · 2020–2021

**Evidence:** React Navigation stack/drawer/tabs, Firebase. Screens include
`AdminLogin`, `ApplicantDetailList`, `ApplicantDetails`, `ConstructionUpdates`,
`ConstructionImagesView`, `DocumentLists`, `MyPayments`, `MyInvoice`, `Chat`,
`Feedback`, `FAQ`, `OtpLogin`, `EmailLogin`, `Notification`, `MyAssist`.

**Reads as:** a home-buyer portal for a residential developer. Buyers log in by
OTP, track construction progress with photographs, read and download their
documents, see invoices and payment schedules, raise assistance requests and
chat with the sales or CRM desk. An admin side reviews applicants.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 2. Property developer — field sales CRM (iOS + Android)
**Repos:** `Emaar-iOS` (Swift, 164 app files), `EmaarSM` (Java), `Sobha-iOS` (Swift), `SobhaSM` (Kotlin) · 5 repos · 2020–2021

**Evidence:** Swift view controllers named `AllActiveOpportunitiesViewController`,
`SiteWiseOpportunityCell`, `CallBackViewController`, `CallDispositionPopViewController`,
`TaskListCell`, `NotificationListCell`, `HomePageViewController`. Android
companions named `…SM`.

**Reads as:** a sales-manager app for property sales teams. Opportunities
segmented by site, call outcomes logged with dispositions, callbacks scheduled,
task lists and push notifications. Native on both platforms rather than
cross-platform, which suggests it was an enterprise standard requirement.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 3. Resale listing platform with eBay integration
**Repos:** `Hammoq-iOS-App` (Swift, 121 app files), `Hammoq-Android-App`, `eBayHammoq` (Node), `iOS-Hammoq` · 4 repos · 2020

**Evidence:** Swift app with camera/image-picker, catalogue, payments, reports
and profile flows. Separate Node service using `ebay-oauth-nodejs-client`,
`express`, `axios`.

**Reads as:** a reseller workflow. Photograph an item on the phone, have it
catalogued and priced, then list it to eBay through an authenticated
integration service. Mobile-first with a thin backend whose real job is the
marketplace API.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 4. Enterprise risk & controls platform (GRC)
**Repos:** `Risk-Backend` (166 files), `Risk-App`, `Risk-Frontend`, `risk-deployer-web`, `Risk_admin` · 12 repos · 2021–2023

**Evidence:** Mongoose models and routes for `RiskMatrix`, `risk`, `riskAction`,
`riskCategory`, `controls`, `controlsAssisment`, `controlsEffect`, `objectives`,
`kpis`, `businessUnit`, `organization`, `group`, `proximity`, `plan`, `invite`.
Stripe, SendGrid, multer, JWT.

**Reads as:** a governance-risk-compliance product. Organisations register
business units, log risks against a matrix, attach controls, assess control
effectiveness, tie risks to objectives and KPIs, and track remediation actions.
Multi-tenant with invitations and subscription billing, so a commercial SaaS
rather than an internal tool.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 5. Enterprise innovation-management platform
**Repos:** `Idea-backend` (224 files), `Idea-App`, `Idea-admin`, `IdeaSEO`, `idea-deployer-app`, `IdeaBackendCode` · 14 repos · 2021–2024

**Evidence:** models/routes for `idea`, `ideaPipeline`, `challenge`,
`challengePipeline`, `stage`, `substages`, `executionBoard`, `kanban`,
`employee`, `organization`, `subdomain`, `permission`, `rule`, `benefitSector`,
`blackListedOrg`, `tags`, `dashboard`. `express-subdomain`, Firebase Admin,
Cloudinary, SendGrid.

**Reads as:** employees submit ideas against company challenges; ideas move
through configurable pipeline stages to an execution board with kanban. Scored
by benefit sector, governed by permissions and rules. `express-subdomain` means
tenant-per-subdomain, so it was sold to multiple organisations.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 6. Local-business deals & offers marketplace
**Repos:** `Deallionaires_Backend`, `Deallionaiers_Android` (Java, 104 app files), `deallionaires-backend`, `deallionairess_kt` · 6 repos · 2019–2020

**Evidence:** MySQL tables/routes for `categories`, `cities`, `collections`,
`advertisement`, `subscription_plan`, `review_rating`, `wish_list`, `fav`,
`bank_details`, `business_images`, `charity`, `contact_enquiry`, `abuse_report`,
`activity_log`, `notifications`. Passport with Facebook login.

**Reads as:** a two-sided local deals platform. Merchants list offers by city
and category with images and bank details for settlement; consumers browse
collections, favourite and review, on a paid subscription tier. Abuse reporting
and activity logs suggest it ran with real public traffic.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 7. HRMS + project management
**Repos:** `HRMS-backend`, `HRMS-frontend`, `hrms-projectManagement-backend` (48 files), `hrms-projectManagement-frontend` · 4 repos · 2020

**Evidence:** models for `Attendance`, `leave`, `project`, `module`, `task`,
`kanban`, `user`, `checkTask`, `editDetails`. Express, Mongoose, JWT, multer,
moment-timezone.

**Reads as:** attendance and leave on one side, project/module/task breakdown
with a kanban board on the other, in one system. The timezone handling suggests
a distributed team.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 8. Contract extraction (document AI)
**Repos:** `ContractExtraction` (Python, 117 files), `ContractFE`, `ContractWebsite` · 3 repos · 2021

**Evidence:** Python project with `contracts/` (46 files), `contracts_pdf/`
(45), `uploaded_files/`, `template/`.

**Reads as:** upload a contract PDF, extract structured fields against a
template, return them for review. A document-AI pipeline with a web front end,
built in 2021.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 9. ML annotation platform (team edition)
**Repos:** `labelImg-server` (45 files), `labelimg`, `labelImg`, `Label_Frames`, `label`, `ImageAnnotate` · 6 repos · 2019–2023

**Evidence:** Mongoose models `Project`, `Dataset`, `User`, `Invites`,
`Notification`; passport-local, multer. The related `ImageAnnotate` front end
carries TensorFlow.js `coco-ssd`, Konva canvas, polygon and bbox tooling, and
Pascal-VOC XML export.

**Reads as:** a labelling platform for ML teams. Projects hold datasets,
teammates are invited and notified, and a detection model pre-annotates images
in the browser before a human corrects them. Shipped from 2019.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 10. Production reporting & BOM system
**Repos:** `rdc-backend` (579 files), `rdc-frontend`, `rdc-qrm-android-app-flutter`, `rdc-qrm-android-app-java`, `rdc_bom`, `RDCOMS`, plus build variants · 11 repos · 2019–2023

**Evidence:** routes including `prod_bom`, `cube`, `rf_7`, `reportsrf7`, plus a
shared `api / db / fxn / mw / my_validator` skeleton. Google APIs, SendGrid,
multer. Companion Flutter and Java Android apps for QRM.

**Reads as:** a production system built around bills of material and
statutory-style report forms, with an OLAP-ish "cube" for aggregation and
mobile apps for shop-floor capture. The largest single backend in the portfolio
by file count.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 11. Quality management system
**Repos:** `QSys`, `QMS-Backend`, `QMS-Frontend`, `QMSClient`, `qms-cron-1`, `qmsnotification`, `qmstwo` · 5–7 repos · 2019–2022

**Evidence:** Express + `promise-mysql` with the same `api / db / fxn / mw /
my_validator` skeleton as RDC and the Tally connector. Separate cron and
notification services.

**Reads as:** a quality-management system with scheduled jobs and a
notification service alongside the main API. Sharing a skeleton with RDC and
Tally suggests an in-house backend framework reused across industrial clients.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 12. Tally / ERP connector
**Repos:** `tally_server`, `Tally_connector`, `Tally_connector-v1`, `Tally-connector`, `Tally-front`, `Tally_admin_panel`, `tally-connect`, `tally1` · 13 repos · 2019–2020

**Evidence:** Express with `promise-mysql`, `csvjson`, `node-schedule`,
`express-validator`; routes `api`, `import_csv`, `myschedule`, `configuration`,
`db`. Plus a front end and an admin panel.

**Reads as:** a scheduled bridge between Tally and a SQL database — pull or
receive exports, normalise, import on a schedule, with an admin panel to
configure mappings. Thirteen repositories means this was iterated on for real
clients, not built once.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 13. Cost estimation tool
**Repos:** `costfinderReactApp` (95 files), `costfinderBackendSql`, `angular-costfinder`, `cosfinder-api`, `costfinder` variants · 10 repos · 2019–2023

**Evidence:** React with Redux Toolkit, `redux-persist`, `chart.js` /
`react-chartjs-2`; a multi-step wizard (`Home`, `Step2`, `Step3`). Earlier
Angular version and a SQL backend.

**Reads as:** a guided estimator — answer a few steps, get a costed output with
charts, with progress persisted between sessions. Rebuilt from Angular to React
over its life.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 14. Equipment rental marketplace
**Repos:** `EquipshareBackend`, `CustomerEquipshare`, `AdminEquipshare`, `EquipshareWebsite`, `Equipshare_master`, `EquipshareIndore.github.io` · 8 repos · 2018–2023

**Evidence:** separate customer, admin and marketing front ends against a
shared backend.

**Reads as:** an equipment-rental marketplace — owners list machinery, renters
book it, an admin console over both. The oldest programme in the portfolio.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 15. Laundry operations platform
**Repos:** `laundry` (127 files), `laundryAdminFrontend`, `laundry-client`, `Laundry-Customer`, `Laundry-supervisor-cum-collection`, `laundary-website`, `laundry-sharable` · 8 repos · 2020

**Evidence:** Express with Mongoose *and* MySQL, `fcm-node` push, JWT. React
admin front end using Auth0. Separate customer app and a
"supervisor-cum-collection" app.

**Reads as:** a full laundry operation — customer ordering, a collection
supervisor app for pickup and delivery rounds, and an admin console, with push
notifications driving the field workflow.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 16. Field service / hospitality platform
**Repos:** `Hammock-Server2`, `Hammock-admin`, `Hammock-agent`, `Hammock-customer`, `hammock-client`, `hammock-server` · 6 repos · 2020

**Evidence:** four distinct clients — customer, agent, admin, plus a shared
server.

**Reads as:** the same shape as the dispatch work: a customer app, a field
agent app and an admin console over one backend.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 17. Aviation route / charter tool
**Repos:** `airlineWeb` (165 files) · 1 repo · 2023

**Evidence:** React with MUI, CoreUI chart components, Redux Toolkit, axios.

**Reads as:** an operator-facing dashboard for routes and availability. The
founder describes it as private-jet route availability.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 18. AR / VR applications
**Repos:** `AR-Game-Flutter` (Dart, 73 files), `Augment_Reality_App`, `AR-VRadmin` · 3 repos · 2022

**Evidence:** Flutter project with iOS and Android targets plus an assets
bundle, and a separate admin surface.

**Reads as:** an augmented-reality application with a content admin behind it.
Thin evidence: this one needs the founder's description more than the others.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 19. Logistics / express delivery
**Repos:** `Safe_express_server` (59 files), `Safe-Express-CustomerApp`, `Delhivery-App` · 2–3 repos · 2020–2021

**Evidence:** Express with Mongoose and MySQL, JWT; a companion customer app.

**Reads as:** a shipment booking and tracking backend with a customer-facing
app.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## 20. Fuel / distribution management
**Repos:** `dms-iocl`, `build_dms`, `dms_withBuild`, `distributionManagementSystem` · 4 repos · 2019–2022

**Evidence:** repository names only; the probe could not read the tree on the
default branch.

**Reads as:** a distribution management system for a fuel or energy
distributor. **Lowest confidence in this document** — I could not read the code.

**Outcome:** _(founder)_ · **Name?** _(founder)_

---

## Cross-cutting observation worth putting on the site

Three separate industrial systems — RDC, QSys/QMS and the Tally connector —
share an identical `api / db / fxn / mw / my_validator` backend skeleton on
Express + `promise-mysql`. That is an in-house framework, reused across clients
over four years. It is evidence of an engineering practice rather than a series
of one-off projects, and nothing on the site says it yet.

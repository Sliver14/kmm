# LOVETOONS INTELLECTUAL ASSET MANAGEMENT PLATFORM

## Full Product Design, Architecture & Development Specification

Build a production-ready **Intellectual Asset Management, Rights & Governance platform** for **Lovetoons / Kiddies Media Ministry**.

The platform is designed to manage intellectual property assets across television, animation, publishing, music, characters, merchandise, digital platforms, events, brands, and related content.

The attached UI screenshots are the **primary visual design reference**. The attached asset/category/governance documents are the **primary business-logic and data-model reference**.

The goal is to reproduce the attached UI as faithfully as reasonably possible while building a real, functional application behind it.

---

# 1. IMPORTANT INSTRUCTIONS ABOUT THE ATTACHMENTS

I will provide:

1. Screenshots of the dashboard
2. Screenshots of the Assets page
3. Screenshots of the Categories & Subcategories page
4. Screenshots of the Relationships page
5. Screenshots of the Rights & Governance page
6. Screenshots of the Approvals page
7. Screenshots of the Reports page
8. Screenshots of the Settings page
9. Screenshot of an individual Asset Details page
10. Screenshot of an individual Asset Rights & Governance page
11. Relevant asset/category/governance documents
12. Additional asset documents and supporting files

Treat these attachments as the **source of truth**.

Do not redesign the application unnecessarily.

Do not replace the visual language with a generic admin dashboard.

Reproduce the following as closely as possible:

* layout
* spacing
* typography
* colours
* cards
* borders
* shadows
* icons
* badges
* tables
* tabs
* navigation
* filters
* buttons
* modals
* forms
* sidebars
* status indicators
* empty states
* pagination
* responsive behaviour
* information hierarchy

Where an attached screenshot and this specification conflict, use the following priority:

1. Explicit functional requirements in this specification
2. Attached governance/business documents
3. Attached UI screenshots
4. Sensible implementation decisions

The application should feel like the same product shown in the screenshots, not a different application inspired by them.

---

# 2. PRODUCT NAME

Primary product:

**Lovetoons Intellectual Asset Management**

Organisation:

**Kiddies Media Ministry**

Brand:

**Lovetoons**

The interface should use the Lovetoons branding shown in the attached screenshots.

---

# 3. CORE OBJECTIVE

Create a centralized system for managing intellectual assets and their:

* ownership
* creators
* contributors
* rights
* licences
* permissions
* territories
* terms
* approvals
* governance controls
* files
* versions
* relationships
* categories
* subcategories
* audit history
* reporting

Every asset must have a complete lifecycle.

The system should answer:

> What is this asset?

> Who owns it?

> Who created it?

> What rights exist?

> Where can it be used?

> For how long?

> Who approved it?

> Which documents prove those rights?

> What other assets is it connected to?

> What changed over time?

> Who changed it?

> When did they change it?

> What was the previous value?

> What is the current value?

> What files support the record?

---

# 4. NON-NEGOTIABLE REQUIREMENT: COMPLETE AUDIT TRAIL

Every important action in the system must be auditable.

This is one of the most important requirements of the application.

Every asset must have a chronological audit trail.

Track at minimum:

* asset created
* asset updated
* asset deleted/archived
* asset restored
* category changed
* subcategory changed
* status changed
* ownership changed
* creator added/removed
* contributor added/removed
* rights added
* rights updated
* rights removed
* licence created
* licence modified
* licence terminated
* territory changed
* term changed
* approved use added/removed
* governance requirement changed
* approval submitted
* approval approved
* approval rejected
* approval returned for changes
* relationship created
* relationship modified
* relationship removed
* file uploaded
* file replaced
* file version created
* file deleted/archived
* metadata changed
* tags changed
* comments added
* user permissions changed
* category created
* category modified
* category archived
* subcategory created
* subcategory modified
* subcategory archived

Each audit event should contain:

```text
ID
Entity Type
Entity ID
Action
Field Changed
Previous Value
New Value
Changed By
Changed At
IP Address where appropriate
User Agent where appropriate
Reason / Comment where applicable
Related File ID where applicable
Related Approval ID where applicable
```

The audit history must be immutable from the normal application interface.

Users must not be able to edit historical audit records.

---

# 5. TECHNOLOGY STACK

Use a modern production-ready architecture.

Preferred stack:

* Next.js
* TypeScript
* React
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* NextAuth/Auth.js or equivalent secure authentication
* Server-side authorization
* Object/file storage abstraction
* Zod or equivalent schema validation
* React Hook Form or equivalent form management

Use clean modular architecture.

Separate:

* UI
* business logic
* validation
* database access
* authorization
* file management
* audit logging
* reporting

Do not place critical business logic only inside UI components.

---

# 6. AUTHENTICATION

Create an authentication experience based on the attached Lovetoons UI style.

Required screens:

### Login

Include:

* Lovetoons logo
* email/username
* password
* remember me
* forgot password
* login button
* validation states
* loading state
* error state

### Forgot Password

Include:

* email
* reset request
* success state
* validation

### Reset Password

Include:

* new password
* confirm password
* password requirements
* success state

### First-time / Invitation Flow

Support invited users.

Possible flow:

```text
Invitation
→ Create Account
→ Set Password
→ Confirm Profile
→ Login
```

Authentication must be protected server-side.

Do not rely only on hiding UI elements.

---

# 7. USERS, ROLES AND PERMISSIONS

Implement role-based access control.

Example roles:

### Super Admin

Full system access.

### Admin

Manage assets, categories, users, governance and approvals.

### Content Lead

Manage programme/content assets and submit for approval.

### Creative Lead

Manage creative assets and contributor information.

### Rights / Legal

Manage ownership, rights, licences, territories and governance.

### Approver

Review and approve submitted assets.

### Viewer

Read-only access.

Permissions should be granular.

Example:

```text
asset.create
asset.view
asset.edit
asset.archive
asset.delete

asset.rights.view
asset.rights.create
asset.rights.edit

asset.files.upload
asset.files.delete

asset.approval.submit
asset.approval.review
asset.approval.approve
asset.approval.reject

relationship.create
relationship.edit
relationship.delete

category.create
category.edit
category.archive

reports.view
audit.view
users.manage
settings.manage
```

Every permission-sensitive action must be checked server-side.

---

# 8. MAIN APPLICATION NAVIGATION

Reproduce the attached sidebar.

Primary navigation:

* Dashboard
* Assets
* Categories & Subcategories
* Relationships
* Rights & Governance
* Approvals
* Reports
* Settings

The active navigation item should visually match the screenshots.

Include:

* Lovetoons logo
* organisation name
* user avatar
* user name
* role
* notification indicator
* collapse/expand behaviour where appropriate

---

# 9. DASHBOARD

Create a dashboard consistent with the attached UI.

Display useful KPIs such as:

* Total Assets
* Approved Assets
* Pending Approvals
* Rights Requiring Attention
* Expiring Rights
* Active Users
* Recent Activity

Include visual reporting:

* asset distribution
* approval status
* category breakdown
* recent activity
* rights alerts
* pending approvals

Data must be calculated from the database.

Do not hardcode dashboard numbers.

---

# 10. ASSET MANAGEMENT

Assets are the central entity of the system.

An asset should support:

```text
Asset
├── Basic Metadata
├── Category
├── Subcategory
├── Status
├── Description
├── Ownership
├── Creators
├── Contributors
├── Rights
├── Governance
├── Licences
├── Approved Uses
├── Territories
├── Relationships
├── Files
├── Versions
├── Approvals
├── Comments
├── Audit History
└── Activity
```

---

# 11. ASSET CATEGORIES

Use the attached governance framework.

Core categories include:

* Animated Programme / Series
* TV Programme / Series
* Documentary / Video
* Film / Short Movie
* Consumer Product / Merchandise
* Publishing / Book
* Publishing / Comics
* Digital / Interactive Platform
* Outreach / Event Format
* Character / Named IP
* Music / Audio
* Brand / Broadcast Platform

Do not create arbitrary categories if the provided governance documents define the official taxonomy.

---

# 12. SUBCATEGORY STRUCTURE

Use category-specific structures.

### Animated Programme / Series

```text
Series
Season
Episode
Master
Version
```

### TV Programme / Series

```text
Series
Season
Episode
Master
Version
```

### Documentary / Video

```text
Programme / Video
Edition / Cut
Master
Version
```

### Film / Short Movie

```text
Film
Cut / Edition
Master
Version
```

### Consumer Product / Merchandise

```text
Product
SKU / Variant
Production Batch / Edition
```

### Publishing / Book

```text
Publication
Edition
Volume / Issue
Version
```

### Publishing / Comics

```text
Series
Volume
Issue / Edition
Digital / Print Version
```

### Digital / Interactive Platform

```text
Platform
Release / Version
Feature / Content Item
```

### Outreach / Event Format

```text
Format
Event Edition / Instance
Recording
Promotional Asset
```

### Character / Named IP

```text
Character
Design / Depiction
Licensed Use / Product
```

### Music / Audio

```text
Composition / Work
Recording / Master
Version / Release
```

### Brand / Broadcast Platform

```text
Brand
Wordmark / Logo
Tagline / Slogan
Brand Guidelines
Application / Version
```

The UI must dynamically change available subcategories based on the selected category.

---

# 13. ADD NEW ASSET MODAL

This is a critical feature.

Create a responsive **Add New Asset** modal/drawer.

The form must dynamically adapt based on the selected category.

Initial step:

```text
Asset Category
↓
Asset Subcategory
↓
Dynamic Asset Form
```

Do NOT show every possible field for every asset.

For example:

If the user selects:

```text
TV Programme / Series
```

show relevant fields such as:

* Series title
* Format
* Description
* Seasons
* Intended audience
* Language
* Broadcast rights
* Streaming rights
* Distribution
* Contributors
* Creators
* Programme files

If the user selects:

```text
Music / Audio
```

show:

* Composition title
* Lyrics
* Songwriters
* Publisher
* Performers
* Producer
* Recording/master
* ISRC if applicable
* Composition rights
* Master rights
* Performance rights
* Synchronisation rights
* Audio files

If the user selects:

```text
Brand / Broadcast Platform
```

show:

* Brand name
* Wordmark
* Logo
* Tagline
* Trademark status
* Trademark number
* Classes/categories
* Territory
* Brand guidelines
* Approved applications
* Brand files

If the user selects:

```text
Consumer Product / Merchandise
```

show:

* Product name
* Product category
* SKU
* Character/IP used
* Manufacturer
* Territory
* Manufacturing rights
* Distribution rights
* Packaging
* Quality control
* Royalty terms

The dynamic form system should be schema-driven rather than implemented as a massive collection of conditional UI hacks.

---

# 14. FILES ARE REQUIRED FOR ASSETS

Every asset must support file/document attachments.

The UI should make file upload a first-class part of asset creation and management.

Depending on the asset type, required documents may include:

* ownership evidence
* creator agreements
* contributor agreements
* talent releases
* copyright certificates
* trademark certificates
* licences
* contracts
* scripts
* manuscripts
* artwork
* logos
* master files
* source files
* audio
* video
* product designs
* brand guidelines
* approval documents
* clearance documents

The system should support configurable required-file rules.

For example:

```text
TV Programme / Series

Required:
✓ Ownership / Chain of Title
✓ Contributor Documentation
✓ Rights Clearance
✓ Master Asset

Optional:
○ Marketing Materials
○ Promotional Artwork
○ Distribution Agreement
```

Do not allow an asset to reach certain governance/approval stages when mandatory documents are missing.

---

# 15. FILE VERSIONING

Never silently replace important files.

When a user uploads a new version:

```text
File v1
↓
File v2
↓
File v3
```

Maintain:

* version number
* filename
* file type
* size
* uploaded by
* uploaded date
* checksum/hash where appropriate
* description
* change reason
* approval status

Users should be able to view/download previous versions where permissions allow.

File replacement must generate an audit event.

---

# 16. INDIVIDUAL ASSET DETAILS PAGE

Reproduce the attached Asset Details UI.

Use tabs such as:

```text
Overview
Sub-assets
Rights & Governance
Relationships
Approvals
Files & Versions
History
```

The page should dynamically adapt to the asset category.

For example, a TV Series should show:

* series information
* seasons
* episodes
* masters
* distribution
* content information

A Music asset should instead show:

* composition
* recording
* performers
* writers
* publisher
* master
* releases

A Brand should show:

* brand identity
* wordmark
* logo
* tagline
* guidelines
* trademark information
* applications

Do not force irrelevant fields into the interface.

---

# 17. RIGHTS & GOVERNANCE DETAILS PAGE

Create the dedicated Rights & Governance page shown in the attached UI.

Include sections such as:

### Ownership / Chain of Title

* owner
* creator
* producer
* commissioning party
* assignment status
* chain-of-title status
* supporting documents

### Rights Clearance

* music
* footage/images
* third-party content
* interviews
* talent releases
* location permissions

### Territory & Term

* territory
* start date
* expiry date
* duration
* exclusivity
* renewal options

### Approved Uses

Examples:

* Broadcast
* Streaming
* Digital
* Educational
* Promotional
* Merchandising
* Publishing
* Adaptation

### Licensing

* licence type
* licensee
* licensor
* royalty
* revenue share
* sublicensing
* restrictions
* effective date
* expiry

### Governance & Controls

Track:

* approval status
* legal review
* rights review
* content approval
* final approval
* mandatory documents
* outstanding issues
* risk flags

---

# 18. RIGHTS MUST BE CATEGORY-SPECIFIC

Rights fields must dynamically adapt to the asset.

For example:

### TV Programme

Track:

* broadcast
* streaming
* digital
* clip rights
* territory
* term
* exclusivity
* translation
* dubbing
* subtitles
* adaptation
* merchandising

### Music

Track:

* composition rights
* master rights
* mechanical rights
* performance rights
* synchronization
* reproduction
* streaming
* territory
* term

### Merchandise

Track:

* IP licence
* manufacturing
* distribution
* product category
* territory
* exclusivity
* royalty
* quality control
* packaging approval

### Brand

Track:

* trademark
* wordmark
* logo
* tagline
* territory
* classes
* approved uses
* co-branding
* licensing
* brand guideline compliance

---

# 19. RELATIONSHIPS

Implement asset-to-asset relationships.

Examples:

```text
Brand
→ Used In → TV Programme

Brand
→ Applied To → Merchandise

Character
→ Appears In → TV Programme

Music
→ Used In → TV Programme

TV Programme
→ Distributed On → Digital Platform

Series
→ Contains → Season

Season
→ Contains → Episode
```

Relationships must be real database entities.

Do not simply store relationship IDs inside an asset.

Each relationship should contain:

```text
Source Asset
Relationship Type
Target Asset
Description
Start Date
End Date
Status
Created By
Created At
```

Relationship creation/modification/deletion must generate audit events.

---

# 20. RELATIONSHIP GRAPH

Reproduce the relationship graph from the attached UI.

Allow users to:

* switch between graph/list views
* filter relationships
* search
* add relationships
* inspect connected assets
* navigate to related assets

The graph should be generated from actual database relationships.

---

# 21. APPROVAL WORKFLOW

Assets should have an approval lifecycle.

Example:

```text
Draft
↓
Submitted
↓
Under Review
↓
Changes Requested
↓
Resubmitted
↓
Approved
↓
Published / Active
```

Support:

* submit
* review
* approve
* reject
* request changes
* resubmit

Every approval action must create:

1. approval record
2. audit event
3. activity event

Approval records should store:

```text
Asset
Reviewer
Action
Comment
Previous Status
New Status
Timestamp
```

---

# 22. APPROVAL PAGE

Reproduce the attached Approvals UI.

Include:

* pending approvals
* approved
* under review
* rejected
* average approval time
* approval workflow
* searchable approval list
* filters
* quick actions
* approval history

Users should be able to open the underlying asset directly from an approval.

---

# 23. CATEGORIES & SUBCATEGORIES PAGE

Reproduce the attached Categories & Subcategories UI.

Show:

* total categories
* total subcategories
* total assets
* active categories
* category list
* subcategory list
* asset counts
* status
* category breakdown
* quick actions

Support:

* add category
* edit category
* archive category
* add subcategory
* edit subcategory
* archive subcategory
* reorder categories
* search
* filters

Categories must not be deleted if doing so would orphan assets unless an explicit migration/reassignment process exists.

---

# 24. REPORTS

Reproduce the attached Reports UI.

Reports should be generated from real data.

Include:

* total assets
* approved assets
* pending approvals
* rights requiring attention
* active users
* asset category breakdown
* approval status
* recent reports
* recent activity

Support reports such as:

```text
Asset Summary Report
Approval Workflow Report
Rights & Licensing Report
Category Breakdown Report
User Activity Report
Financial / Royalty Report
Audit Report
```

Allow export where appropriate.

---

# 25. SETTINGS

Reproduce the attached Settings page.

Sections:

```text
General
Users & Permissions
Roles
Notifications
Integrations
System
```

General settings:

* organisation information
* brand information
* logo
* colours
* timezone
* date format
* language

Security:

* 2FA
* session timeout
* trusted devices
* IP restrictions where applicable

Notifications:

* approval notifications
* rights expiry reminders
* asset updates
* system announcements

Data management:

* backups
* retention
* exports

---

# 26. RIGHTS EXPIRY SYSTEM

The system must automatically identify rights that are:

* expired
* expiring soon
* active
* perpetual
* pending renewal

Provide configurable warning periods.

For example:

```text
90 days
60 days
30 days
7 days
```

Display warnings on:

* dashboard
* asset page
* rights page
* reports
* notifications

---

# 27. SEARCH

Global search should support:

* asset name
* ID
* category
* subcategory
* creator
* owner
* rights
* relationship
* file name
* tags

Search results should allow navigation directly to the relevant entity.

---

# 28. RESPONSIVE DESIGN

The attached desktop screenshots are the primary reference, but the entire application must be responsive.

Support:

* desktop
* laptop
* tablet
* mobile

Do not simply shrink the desktop layout.

For mobile:

* sidebar becomes drawer
* tables become cards or horizontally scrollable where appropriate
* multi-column forms become single-column
* asset details reorganize
* rights sections stack
* modals become full-screen drawers
* graph becomes a mobile-friendly relationship list/interactive view
* action buttons remain accessible

---

# 29. RESPONSIVE ADD-ASSET FORM

The Add Asset modal is especially important.

Desktop:

```text
Large modal / multi-column layout
```

Tablet:

```text
Reduced columns
```

Mobile:

```text
Full-screen form
```

The dynamic fields must remain category-specific at every breakpoint.

---

# 30. DATA MODEL

Create a normalized database model.

At minimum, consider entities:

```text
User
Role
Permission
RolePermission

Organisation

Asset
AssetCategory
AssetSubcategory
AssetStatus
AssetTag

AssetCreator
AssetContributor
Person / OrganisationParty

AssetRight
RightType
RightStatus

Licence
LicenceParty
LicenceRestriction

Territory
AssetTerritory

ApprovedUse
AssetApprovedUse

Relationship
RelationshipType

AssetFile
FileVersion
FileRequirement

Approval
ApprovalStep
ApprovalAction

AuditEvent

Comment
ActivityEvent

Notification

Report
```

Use relational integrity.

Avoid storing major structured information as JSON when it should be relational.

JSON may be used for genuinely dynamic category-specific metadata, but important searchable/governed information should remain queryable.

---

# 31. DYNAMIC CATEGORY SCHEMAS

Implement a category schema layer.

For example:

```typescript
AssetCategorySchema {
  category
  subcategories
  fields
  requiredFields
  requiredFiles
  rightsSchema
  governanceSchema
  approvalSchema
}
```

This allows new asset categories to be introduced without rewriting the entire application.

The UI should render forms based on the schema.

---

# 32. AUDIT LOGGING ARCHITECTURE

Create a centralized audit service.

Example conceptual API:

```typescript
audit.log({
  entityType: "ASSET",
  entityId,
  action: "UPDATED",
  actorId,
  changes: {
    name: {
      before: "Old Name",
      after: "New Name"
    }
  }
})
```

Do not rely on developers remembering to manually log every action.

Important mutations should automatically trigger audit events through service-layer logic.

Audit logs must include before/after values whenever meaningful.

---

# 33. ACTIVITY TIMELINE

Every asset should have a human-readable activity timeline.

Example:

```text
Today

10:42 AM
Pastor Chelsea Kalu updated the asset description.

9:15 AM
James Dada uploaded Contract_v2.pdf.

Yesterday

4:20 PM
Faith Daniel approved Rights Clearance.

Sep 20

10:24 AM
Asset created by Pastor Chelsea Kalu.
```

Each event should link to the relevant entity/document where appropriate.

---

# 34. FILE SECURITY

Uploaded files must be protected.

Do not expose private files through unrestricted public URLs.

Implement:

* authorization checks
* secure file access
* file type validation
* file size limits
* safe filenames
* virus/malware scanning architecture where available
* access logging
* versioning

Never trust the client-provided MIME type alone.

---

# 35. SOFT DELETE / ARCHIVING

Important intellectual assets should generally not be hard deleted.

Use:

```text
Active
Archived
Restored
```

When an asset is archived:

* record who archived it
* record when
* record reason
* retain files
* retain relationships
* retain audit history

Hard deletion should be restricted to exceptional administrative operations.

---

# 36. UI DESIGN SYSTEM

Follow the attached screenshots.

Use:

* navy/dark sidebar
* white/light workspace
* rounded cards
* subtle shadows
* blue primary actions
* pastel category colours
* compact status badges
* clear icons
* modern typography
* generous spacing
* professional SaaS appearance

Maintain visual consistency across all pages.

Create reusable components:

```text
PageHeader
Sidebar
Topbar
StatCard
StatusBadge
CategoryBadge
DataTable
FilterBar
SearchInput
Modal
Drawer
Tabs
AssetCard
FileUploader
FileVersionList
ActivityTimeline
AuditTimeline
RightsCard
GovernanceCard
ApprovalBadge
RelationshipGraph
EmptyState
ConfirmDialog
Toast
Pagination
```

---

# 37. CATEGORY-SPECIFIC COLOUR CODING

Use consistent category colours across:

* asset lists
* badges
* relationship graph
* asset details
* reports
* filters

Do not randomly change category colours between pages.

---

# 38. VALIDATION

Use robust validation.

Validate:

* required fields
* dates
* date ranges
* territory
* licence terms
* file types
* file size
* email addresses
* duplicate assets where appropriate
* duplicate relationships
* ownership conflicts
* approval prerequisites

Provide clear inline validation messages.

---

# 39. ERROR HANDLING

Implement proper:

* loading states
* skeleton states
* empty states
* error states
* retry states
* success notifications
* confirmation dialogs

Never allow silent failures.

---

# 40. PERFORMANCE

The system should remain responsive with thousands of assets.

Implement:

* pagination
* server-side filtering
* indexed database queries
* optimized relations
* lazy loading
* efficient file handling
* debounced search
* caching where appropriate

Do not load every asset into the browser at once.

---

# 41. SECURITY

Implement:

* authentication
* authorization
* server-side permission checks
* CSRF protection where applicable
* secure session management
* input validation
* file validation
* rate limiting for sensitive endpoints
* secure password handling
* audit logging
* protected administrative operations

Never expose sensitive information to unauthorized users.

---

# 42. SEED DATA

Create realistic seed data based on the attached UI.

Examples:

### Brand

Lovetoons

### TV Programme

Lovetoons TV Series

### Character

Tilly

### Music

Theme Song

### Publishing

The Power of Prayer

### Merchandise

Lovetoons Merchandise

### Digital Platform

Lovetoons Digital Platform

Create realistic relationships between them.

Do not hardcode these values in components.

Seed them through the database.

---

# 43. IMPORTANT UI BEHAVIOUR

When a user clicks:

### Asset

Open Asset Details.

### Rights & Governance

Open the asset's governance page.

### Relationship

Open relationship details and allow navigation to both assets.

### Approval

Open approval workflow.

### File

Open file/version information.

### Category

Open category details and associated assets.

### User

Open user profile/permissions where authorized.

Everything should be connected.

Avoid dead buttons.

---

# 44. NO FAKE FUNCTIONALITY

Do not create buttons that only look functional.

For every visible action:

* implement the action
* validate it
* persist it
* update UI
* create audit event
* create activity event where appropriate

If a feature is intentionally unavailable, display a proper disabled state rather than pretending it works.

---

# 45. ACCEPTANCE TESTS

The finished application should support this workflow:

```text
Login
↓
Dashboard
↓
Assets
↓
Add Asset
↓
Select Category
↓
Select Subcategory
↓
Dynamic Form Appears
↓
Upload Required Files
↓
Save Draft
↓
Audit Event Created
↓
Open Asset Details
↓
Add Rights
↓
Upload Rights Evidence
↓
Create Relationship
↓
Submit for Approval
↓
Reviewer Opens Approval
↓
Reviewer Approves
↓
Asset Status Changes
↓
Audit Event Created
↓
Activity Timeline Updated
↓
Reports Update
```

Test the entire workflow.

---

# 46. AUDIT TEST

Specifically test:

```text
Create Asset
→ Audit: Created

Change Name
→ Audit: Name changed
→ Before/After stored

Change Category
→ Audit: Category changed

Upload File
→ Audit: File uploaded

Replace File
→ Audit: Version created

Add Right
→ Audit: Right added

Modify Territory
→ Audit: Territory changed

Create Relationship
→ Audit: Relationship created

Submit Approval
→ Audit: Approval submitted

Approve
→ Audit: Approval approved

Archive
→ Audit: Asset archived
```

The audit timeline must accurately represent the complete lifecycle.

---

# 47. DESIGN REPLICATION REQUIREMENT

I will attach screenshots of every major page.

Use image analysis to replicate the UI.

Do not approximate unnecessarily.

Pay particular attention to:

* exact page structure
* sidebar width
* top navigation
* card placement
* typography hierarchy
* button dimensions
* icon placement
* table columns
* badge styles
* spacing
* border radius
* shadows
* colours
* responsive behaviour

If the screenshot contains a visual component that has not been explicitly described here, implement it.

The screenshots represent the intended visual product.

---

# 48. DOCUMENT-DRIVEN GOVERNANCE

I will also attach governance documents.

Read and understand them before implementing:

* asset categories
* subcategories
* governance requirements
* rights requirements
* approval controls
* relationships
* required documentation

Do not invent governance rules where the documents already define them.

Where the documents specify:

```text
Category
→ Sub-asset structure
→ Rights
→ Governance controls
```

implement those rules into the application.

---

# 49. FINAL QUALITY BAR

The final application should feel like a real enterprise intellectual property management platform rather than a CRUD demo.

It must have:

* polished UI
* functional navigation
* real database persistence
* dynamic asset forms
* category-specific governance
* secure authentication
* RBAC
* file management
* versioning
* rights management
* approvals
* relationships
* reporting
* complete audit trail
* responsive design
* scalable architecture

Most importantly:

**Every asset must be traceable from creation to its current state, including every important change, approval, right, relationship, document and version associated with it.**

---

# 50. DEVELOPMENT APPROACH

Before writing significant code:

1. Inspect every attached UI screenshot.
2. Inspect every attached governance/asset document.
3. Identify the common design system.
4. Identify all entities and relationships.
5. Design the database schema.
6. Design the permission model.
7. Design the dynamic category schema.
8. Design the audit architecture.
9. Build the application shell.
10. Build authentication.
11. Build the database and seed data.
12. Build Assets.
13. Build dynamic Add Asset.
14. Build Asset Details.
15. Build Rights & Governance.
16. Build Relationships.
17. Build Approvals.
18. Build Categories & Subcategories.
19. Build Reports.
20. Build Settings.
21. Implement audit history throughout.
22. Implement file/version management.
23. Implement responsive behaviour.
24. Test all workflows.
25. Compare every page against the attached screenshots and refine the UI.

Do not rush directly into building individual pages before understanding the complete data model.

The system architecture should be designed so that the UI, governance rules, asset categories and audit system work together as one coherent platform.

# n8n-nodes-payloadcms

This package provides a community node to interact with the [Payload CMS](https://payloadcms.com/) API from within [n8n](https://n8n.io/).

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n documentation.

## Operations

- Create collection entries
- Delete collection entries
- Get a collection entry
- Get many collection entries
- Update collection entries

## Credentials

Create an API key in Payload CMS and enter your CMS base URL and key in the node credentials. The node sends requests with an `Authorization` header in the format `<collection-slug> API-Key <token>` as required by Payload CMS.

## Development

Build the TypeScript sources:

```
npm run build
```

The node follows the standard n8n community node structure. It includes:

- `credentials/PayloadCmsApi.credentials.ts` – credentials for API key authentication
- `helpers/GenericFunctions.ts` – request helper
- `nodes/PayloadCms/PayloadCms.node.ts` – the node itself

Use it to create, read, update and delete entries in your Payload CMS collections.

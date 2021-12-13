#!/usr/bin/env node

import { amendCommit } from "./index.mjs"

const isWorthy = ({ hash }) =>
  hash.startsWith("91731337")

amendCommit(isWorthy)

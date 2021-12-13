import { exec } from "child_process"
import { createHash } from "crypto"
import "./iter.mjs"

const runCommand = (command, options = {}) =>
  new Promise((resolve, reject) => {
    exec(command, options, (error, stdout) => {
      if (error)
        reject(error)
      else
        resolve(stdout)
    })
  })

const getHash = (input, type = "commit") =>
  createHash("sha1")
    .update(`${type} ${Buffer.byteLength(input)}\0${input}`)
    .digest("hex")

const getCommit = (ref = "HEAD") =>
  runCommand(`git --no-replace-objects cat-file commit ${ref}`)

const extractCommitTimes = commit => {
  const match = commit.match(
    /(.*?)(^author.*? )(\d+)( (?:-|\+)\d{4})?(\n^committer.*?)(\d+)( (?:-|\+)\d{4})?(.+)/sm
  )

  const _times = {
    author:    parseInt(match[3]),
    committer: parseInt(match[6])
  }
  const _timeZones = {
    author:    match[4] ?? "",
    committer: match[7] ?? ""
  }

  const template = (times = _times, timeZones = _timeZones) =>
    match[1] +
    match[2] + times.author    + timeZones.author +
    match[5] + times.committer + timeZones.committer +
    match[8]

  return {
    times:     _times,
    timeZones: _timeZones,
    template
  }
}

/*
a,b where a <= b

for n = 3:
0,1 1,1
0,2 1,2 2,2
0,3 1,3 2,3 3,3

combinations = ((n+1)^2 + n+1) / 2 - 1
git hash first part is 8 hex characters (16^8 possible)
16^8 = ((n+1)^2 + n+1) / 2 - 1
n ~= 92,680.4
  ~= 1 day + 1 hour + 44 minutes + 40 seconds expected increase from start time

*/
function * generateTimes({ author, committer }) {
  for (let b = 1;       ; b++)
  for (let a = 0; a <= b; a++)
    yield {
      author:    author    + a,
      committer: committer + b
    }
}

const filteredChoices = (template, startTimes, filter) =>
  generateTimes(startTimes)
    .map(times => ({
      times,
      hash: getHash(template(times))
    }))
    .filter(filter)

export const amendCommit = async (isWorthy) => {
  const commit = await getCommit()
  const {
    times,
    timeZones,
    template
  } = extractCommitTimes(commit)

  const [choice] = filteredChoices(template, times, isWorthy).take(1)

  return runCommand(
    `git commit --amend --no-edit --date '${choice.times.author + timeZones.author}'`, {
    env: {
      ...process.env,
      GIT_COMMITTER_DATE: choice.times.committer + timeZones.committer
    }
  })
}

#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const year = process.argv[2]
const month = process.argv[3] || '01'
const day = process.argv[4] || '01'

function format (date) {
  const YYYY = date.getFullYear() + ''
  const MM = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
  const DD = (date.getDate() < 10 ? '0' : '') + (date.getDate())
  return {
    YYYY: YYYY,
    MM: MM,
    DD: DD
  }
}

function createFolder (folderPath) {
  try {
    const stat = fs.statSync(folderPath)
    if (stat.isDirectory()) {
      console.log(folderPath, 'exists')
    } else {
      console.error(folderPath, 'exists and is not a directory')
      process.abort()
    }
  } catch (e) {
    console.log('Create', folderPath)
    fs.mkdirSync(folderPath)
  }
}

function createFile (filePath) {
  try {
    const stat = fs.statSync(filePath)
    if (stat.isFile()) {
      console.log(filePath, 'exists')
    } else {
      console.error(filePath, 'exists and is not a file')
      process.abort()
    }
  } catch (e) {
    console.log('Create', filePath)
    fs.openSync(filePath, 'w')
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
}

function createDiary (cwd, YYYY, MM, DD) {
  const yearFolder = path.join(cwd, YYYY)
  const monthFolder = path.join(cwd, YYYY, MM)
  const fileName = path.join(cwd, YYYY, MM, [YYYY, MM, DD].join('-') + '.md')

  createFolder(yearFolder)
  createFolder(monthFolder)
  createFile(fileName)
}

if (year === 'today') {
  let date = new Date()
  let formatted = format(date)
  createDiary(process.cwd(), formatted.YYYY, formatted.MM, formatted.DD)
} else if (/\d{4}/.test(year) && /\d{1,2}/.test(month) && /\d{1,2}/.test(day)) {
  let date = new Date(Number(year), Number(month) - 1, Number(day))
  let formatted = format(date)
  createDiary(process.cwd(), formatted.YYYY, formatted.MM, formatted.DD)
} else {
  console.error('[ERROR]: Run either `dairy-cli today` or `diary-cli [YYYY] [MM] [DD]`')
  process.abort()
}

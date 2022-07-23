require('dotenv').config()
const { createProxyMiddleware } = require('http-proxy-middleware')
const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 9000

app.use(express.static(path.resolve(__dirname, 'build')))
app.use(createProxyMiddleware('/usersrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/regsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/provsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/utilsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/mfasrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/rulesrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/authsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/workflowsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/selfservice', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))
app.use(createProxyMiddleware('/samlsrvc', { target: 'http://a11d129a002d046c09249fbc63ccdd78-940691642.ap-south-1.elb.amazonaws.com' }))

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

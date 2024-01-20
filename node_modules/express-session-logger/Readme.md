# express-session-logger

  A simple way for add custom context to all logs into you express session

  Comes with a pre configured winston logger

  Support for custom loggers. Any logger with `.child` interface should work.

  Manage log verbosity with environment variable: `process.env.LOG_LEVEL`

## Module interface

* `contextMiddleware => (opt) => (req,res,next)`: express middleware

```jsdoc
 * @param {*} opt options
 * @param {string=} opt.idField - idField
 * @param {string=} opt.ontextField - contextField
 * @param {function=} opt.id - id mapper
 * @param {function=} opt.context - context mapper
 * @param {Object=} opt.loggerInstance - custom loggerInstance
```

> Example:
>
>
>
```js
app.use(contextMiddleware({
  loggerInstance: //ex. winston logger, pino logger or undefined for default logger
  idField: '_id',
  id: (req) => req.header.x-request-id, // or uuid.v4()
  contextField: '_context',
  context: (req) => ({
    stage: process.env.STAGE,
    service: process.env.SERVICE,
    reqContext: req.someInterestingRequestInfo
  }),
}));
```

* `logger`: A logger instance (pre configured winston logger by default)

> NOTE: `logger` is equal to `loggerInstance` if its defined in `contextMiddleware`, or default logger in other case

In this example, all logs via logger for this express request have the structure

```json
{
  "_id": //id value
  "_context": {
    "stage": "...", //stage
    "service": "...",//service name
    "reqContext": {
      // someInterestingRequestInfo
    }

  }
  //....remaining info, depends on log instance
}
```

**So, you can correlate easily all logs in one session**

## Default logger

WIP:...

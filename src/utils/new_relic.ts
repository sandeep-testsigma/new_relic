import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
import { JSErrors } from "@newrelic/browser-agent/features/jserrors";

const newrelic = new BrowserAgent({
  init: {
    proxy: {
      beacon: "bam.nr-data.net",
    },
  },
  info: {
    licenseKey: "NRJS-3018cce14ac2c3bb27e",
    applicationID: "601561630",
  },
  loader_config: {
    spa: {
      enabled: true,
    },
    distributedTracing: {
      enabled: true,
    },
    customAttributes: {
      enabled: true,
    },
  },
  features: [JSErrors],
});

export const sendError = (error: Error, extraInfo?: React.ErrorInfo) => {
  newrelic?.noticeError(error, { extra: extraInfo });
};

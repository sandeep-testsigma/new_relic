import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
// Populate using values in copy-paste JavaScript snippet.
import { JSErrors } from '@newrelic/browser-agent/features/jserrors'

const browserAgent = new BrowserAgent({
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

export default browserAgent;

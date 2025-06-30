import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
import { JSErrors } from "@newrelic/browser-agent/features/jserrors";
import { GenericEvents } from '@newrelic/browser-agent/features/generic_events';
import { Spa } from '@newrelic/browser-agent/features/spa';
interface NewRelicConfig {
  licenseKey: string;
  applicationID: string;
  proxy?: {
    beacon: string;
  };
  spa?: {
    enabled: boolean;
  };
  distributedTracing?: {
    enabled: boolean;
  };
  customAttributes?: {
    enabled: boolean;
  };
}

class NewRelicService {
  private newrelic: BrowserAgent | null = null;
  private config: NewRelicConfig;

  constructor(config?: Partial<NewRelicConfig>) {
    this.config = {
      licenseKey: "NRJS-3018cce14ac2c3bb27e",
      applicationID: "601561630",
      proxy: {
        beacon: "bam.nr-data.net",
      },
      spa: {
        enabled: true,
      },
      distributedTracing: {
        enabled: true,
      },
      customAttributes: {
        enabled: true,
      },
      ...config,
    };
  }

  init() {
    if (this.newrelic) {
      console.warn("NewRelic already initialized. Use reinit() to reinitialize with new config.");
      return;
    }

    this.newrelic = new BrowserAgent({
      init: {
        proxy: this.config.proxy,
      },
      info: {
        licenseKey: this.config.licenseKey,
        applicationID: this.config.applicationID,
      },
      loader_config: {
        spa: this.config.spa,
        distributedTracing: this.config.distributedTracing,
        customAttributes: this.config.customAttributes,
      },
      features: [JSErrors, GenericEvents,Spa],
    });
    this.newrelic.start()
  }

  updateConfig(newConfig: Partial<NewRelicConfig>) {
    this.config = { ...this.config, ...newConfig };
    // Note: Just updating config doesn't affect the running agent instance
    // Call reinit() to apply the new configuration
    this.reinit();
  }

  reinit() {
    // Destroy existing instance if it exists
    if (this.newrelic) {
      // Note: BrowserAgent doesn't have a destroy method, so we just nullify it
      this.newrelic = null;
    }
    
    // Initialize with updated config
    this.init();
  }

  sendPageView(name: string, host?: string) {
    if (!this.newrelic) {
      console.warn("NewRelic not initialized. Call init() first.");
      return;
    }
    this.newrelic.setPageViewName(name, host);
  }

  addCustomEvent(name: string, attributes?: Record<string, unknown>) {
    if (!this.newrelic) {
      console.warn("NewRelic not initialized. Call init() first.");
      return;
    }
    this.newrelic.recordCustomEvent(name, attributes);
  }


  sendPageAction(name: string, attributes?: Record<string, unknown>) {
    if (!this.newrelic) {
      console.warn("NewRelic not initialized. Call init() first.");
      return;
    }
    this.newrelic.addPageAction(name, attributes);
  }


  sendError(error: Error, extraInfo?: React.ErrorInfo) {
    if (!this.newrelic) {
      console.warn("NewRelic not initialized. Call init() first.");
      return;
    }
    try {
      this.newrelic.noticeError(error, { extra: extraInfo });
    } catch (e) {
      console.error("Error sending error to NewRelic", e);
    }
  }
}

export default NewRelicService;
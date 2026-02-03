import type {
  AnyContext,
  BaseEvent,
  Chart,
  ChartDefinition,
  ChartInstance,
  ExportedChart,
} from './types.js';
import type { SCJSONDocument } from './scjson-types.js';
import { createInstance } from './instance.js';
import { exportChartLegacy } from './export.js';
import { exportSCJSON } from './scjson-export.js';

export function chart<TContext extends AnyContext, TEvent extends BaseEvent = BaseEvent>(
  definition: ChartDefinition<TContext, TEvent>
): Chart<TContext, TEvent> {
  return {
    get definition(): ChartDefinition<TContext, TEvent> {
      return definition;
    },

    start(initialContext?: Partial<TContext>): ChartInstance<TContext, TEvent> {
      return createInstance(definition, initialContext);
    },

    export(): SCJSONDocument {
      return exportSCJSON(definition);
    },

    exportLegacy(): ExportedChart {
      return exportChartLegacy(definition);
    },
  };
}

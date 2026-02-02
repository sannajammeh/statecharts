import type {
  AnyContext,
  BaseEvent,
  Chart,
  ChartDefinition,
  ChartInstance,
  ExportedChart,
} from './types.js';
import { createInstance } from './instance.js';
import { exportChart } from './export.js';

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

    export(): ExportedChart {
      return exportChart(definition);
    },
  };
}

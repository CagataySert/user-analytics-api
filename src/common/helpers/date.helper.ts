import * as moment from 'moment';
import { TimeRange } from '../constants/time-range.constant';

export class DateHelper {
  static getDateFromRange(range: TimeRange): Date {
    switch (range) {
      case TimeRange.LAST_7_DAYS:
        return moment().subtract(7, 'days').toDate();
      case TimeRange.LAST_24_HOURS:
        return moment().subtract(24, 'hours').toDate();
      default:
        throw new Error(`Unknown TimeRange: ${range}`);
    }
  }
}

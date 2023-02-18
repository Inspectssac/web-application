export class DateRange {
  _dateStart: Date
  _dateEnd: Date

  constructor ({ dateStart = new Date(), dateEnd = new Date() } = {}) {
    this._dateStart = dateStart
    this._dateEnd = dateEnd
  }

  static fromJson = (json: any): DateRange => {
    const dateStart = json['date-start'] ? new Date(json['date-start']) : new Date()
    const dateEnd = json['date-end'] ? new Date(json['date-end']) : new Date()
    return new DateRange({ dateStart, dateEnd })
  }

  toObject = (): DateRangeObject => {
    return {
      'date-start': this.formattedDateStart(),
      'date-end': this.formattedDateEnd()
    }
  }

  formattedDateStart = (): string => this._dateStart.toISOString().split('T')[0]
  formattedDateEnd = (): string => this._dateEnd.toISOString().split('T')[0]
}

export interface DateRangeObject {
  'date-start': string
  'date-end': string
}

from icalendar import Calendar, Event
import requests
import datetime
from dateutil import rrule
import copy

athene_calendar_url = "https://www.google.com/calendar/ical/athenekilta%40gmail.com/public/basic.ics"

# icalendar parsing based on https://gist.github.com/meskarune/63600e64df56a607efa211b9a87fb443

# Does not take into account the possible exdate field
def parse_recur(event, rule):
    rule = rrule.rrulestr(rule, dtstart=event['startdt'])
    events = []
    for startdt in list(rule):
        tmp_event = copy.deepcopy(event)
        tmp_event['startdt'] = startdt
        events.append(tmp_event)
    return events


def get_future_events():
    calendar_data = requests.get(athene_calendar_url).text
    cal = Calendar().from_ical(calendar_data)
    events = []
    for event in cal.walk(name="VEVENT"):
        parsed = {
            'summary': event.get('summary'),
            'description': event.get('description'),
            'location': event.get('location'),
            'startdt': event.get('dtstart').dt,
            #'enddt': event.get('dtend'),
            'exdate': event.get('exdate'),
        }
        if event.get('rrule'):
            rule = event.get('rrule').to_ical().decode('utf-8')
            instances = parse_recur(parsed, rule)
            for instance in instances:
                if instance.get('startdt').timetuple() > datetime.datetime.now().timetuple():
                    events.append(instance)
        if event.get('dtstart').dt.timetuple() > datetime.datetime.now().timetuple():
            events.append(parsed)

    events.sort(key=lambda x: x['startdt'].timetuple())
    return events[:3]


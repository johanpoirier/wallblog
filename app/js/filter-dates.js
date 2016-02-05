var now = new Date();
var years = [];
for (var year = now.getFullYear(); year >= 2011; year -= 1) {
  years.push(year);
}

var months = [
  { id: "01", value: "Janvier" },
  { id: "02", value: "Février" },
  { id: "03", value: "Mars" },
  { id: "04", value: "Avril" },
  { id: "05", value: "Mai" },
  { id: "06", value: "Juin" },
  { id: "07", value: "Juillet" },
  { id: "08", value: "Août" },
  { id: "09", value: "Septembre" },
  { id: "10", value: "Octobre" },
  { id: "11", value: "Novembre" },
  { id: "12", value: "Décembre" }];

export default {
  'years': years,
  'months': months
};

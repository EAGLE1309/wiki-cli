import gradient from 'gradient-string';
import figlet from 'figlet'

const title = () => figlet.text("Wiki", { font: "Roman", whitespaceBreak: true }, function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(gradient.pastel(data));
});

export default title
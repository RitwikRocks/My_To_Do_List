module.exports.date=date;

function date() {

    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    // day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = today.toLocaleDateString("en-IN", options);

    return day; 
}

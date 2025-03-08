export default function(source) {
    if (source.indexOf("\r") != -1) {
        return source.split("\r\n")
    } else {
        return source.split("\n")
    }
}
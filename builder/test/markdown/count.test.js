import assert from "node:assert/strict"
import { checkType } from "../util.js"
import countWord from "../../../src/utils/countWord.js"

describe("Paragraph word counter", () => {
    it("should be a function", () => {
        assert.ok(checkType(countWord, Function))
    })

    it("should count CJK words", () => {
        // Chinese
        assert.equal(countWord("你好 你好"), 4)
        // Japanes
        assert.equal(countWord("この日本語段落はひらがなとカタカナが含まれています。正しくカウントされていることを確認してください。"), 48)
        // Korean
        assert.equal(countWord("이 한국어 단락은 한글 문자로 작성되었습니다. 띄어쓰기와 구두점을 기준으로 단어 수를 정확하게 계산하십시오."), 46)
    })

    it("should count English words", () => {
        assert.equal(countWord("This is a simple English paragraph. It contains no special characters or punctuation."), 13)
    })
    it("should count European language words", () => {
        // French
        assert.equal(countWord("Cette phrase française contient des caractères diacritiques comme des accents et des cédilles. Vérifiez qu'ils ne sont pas comptés comme des mots séparés."), 24)
        // German
        assert.equal(countWord("Dieser deutsche Satz enthält Umlaute wie ä, ö und ü. Stellen Sie sicher, dass sie als Teil des Wortes erkannt werden."), 21)
        // Spanish
        assert.equal(countWord("Este párrafo en español contiene caracteres acentuados como 'á', 'é' e 'í'. Asegúrese de que no se cuenten como palabras separadas."), 21)
    })
    it("should count Greek characters", () => {
        assert.equal(countWord("Το ελληνικό αυτό κείμενο περιέχει διακριτικά όπως τόνους και αποστρόφους. Βεβαιωθείτε ότι αυτά δεν μετρώνται ως ξεχωριστές λέξεις."), 18)
    })
    it("should count Cyrillic characters", () => {
        assert.equal(countWord("Этот русский абзац написан кириллицей. Убедитесь, что подсчет слов работает правильно."), 11)
    })
    it("should count Arabic characters", () => {
        assert.equal(countWord("هذه فقرة عربية مكتوبة من اليمين إلى اليسار. تأكد من أن عد الكلمات يعمل بشكل صحيح"), 16)
    })

    it("should count numbers", () => {
        assert.equal(countWord("123 -123 1.23 -1.23 .23"), 5)
    })

    it("should ignore symbols", () => {
        assert.equal(countWord(" ,.;'/[]\\!@#$%^&*()-=_+《》，。、；‘：“「」『』、·——=！%……*（）"), 0)
    })
})
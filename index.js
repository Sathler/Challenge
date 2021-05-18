//Vinicius Sathler
//18-05-2021

//=========================================================== Classes =================================================================

class Address{
    constructor(type, address){
        this.type = type;
        this.tags = new Array();
        this.address = address
    }

    setType(type){
        this.type = type;
    }

    setAddress(adress){
        this.address = adress;
    }

    get getType(){
        return this.type;
    }

    get getAddress(){
        return this.address;
    }
    
    addTag(listTags){
        for(var i=0; i<listTags.length; i++){
            if(this.tags.indexOf(listTags[i]) == -1 && !(listTags[i] === "")){
                this.tags.push(listTags[i]);
            }
        }
    }

    
}


class User{
    constructor(fullname, eid, invisible = false, see_all = false){
        this.fullname = fullname;
        this.eid = eid;
        this.groups = new Array();
        this.addresses = new Array();        
        this.invisible = invisible;
        this.see_all = see_all;
    }

    get getEid(){
        return this.eid;
    }

    get getFullname(){
        return this.fullname;
    }

    get getInvisble(){
        return this.invisible;
    }

    get getSeeAll(){
        return this.see_all;
    }

    addAddress(address, type, listTags){
        var cond = true;
        for(var i=0; i < this.addresses.length; i++){
            if(this.addresses[i].getAddress === address && this.addresses[i].getType === type){
                this.addAddress[i].addTag(listTags);
                cond = false;
                break;
            }
        }
        if(cond){
            var newAddress = new Address(type, address);
            newAddress.addTag(listTags);
            this.addresses.push(newAddress);
        }
    }

    addGroup(listGroup){
        for(var i=0; i<listGroup.length; i++){
            if(this.groups.indexOf(listGroup[i]) == -1 && !(listGroup[i] === "")){
                this.groups.push(listGroup[i]);
            }
        }
    }
}

//================================================================ metodos utilitarios ============================================================

//comparator para ordenar linhas de registros pelo id do usuario
function compareEID(a, b){
    if(parseInt(a[eidIndex]) < parseInt(b[eidIndex])) return -1;
    else if(parseInt(a[eidIndex]) > parseInt(b[eidIndex])) return 1;
    else return 0;
}

function matchBool(boolean){
    if(boolean === 'yes' || boolean == 1) return true;
    else return false;
}

//============================================================== metodo de parse ===============================================================

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    if (!re_valid.test(text)) return null;

    var a = [];
    text.replace(re_value,
        function(m0, m1, m2, m3) {

            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return '';
        });

    if (/,\s*$/.test(text)) a.push('');
    return a;
};

//================================================================ metodos iterativos ===========================================================

function mergeContent(headings, content){
    var mergedContent = new Array();
    mergedContent.push(content[0]);
    var mergedContentLine = 0;
    for(var i = 1; i< content.length; i++){
        if(content[i][eidIndex] == content[i-1][eidIndex]){
            for(var j=0; j<headings.length; j++){
                switch(headings[j]){
                    case 'fullname':
                    case 'eid':
                    case 'invisible':
                    case 'see_all': //conteudo destes campos nao precisa ser "somado";
                        break;
                    default:
                        mergedContent[mergedContentLine][j] = mergedContent[mergedContentLine][j].concat(' , ', content[i][j]);
                        break;
                }
            }
        }
        else{
            mergedContent.push(content[i]);
            mergedContentLine++;
        }
    }
    return mergedContent;
}

function generateListOfUsers(mergedContent){
    var listOfUsers = new Array();
    for(var i=0; i<mergedContent.length; i++){
        var user = new User(mergedContent[i][fullnameIndex], mergedContent[i][eidIndex], matchBool(mergedContent[i][InvisibleIndex]), matchBool(mergedContent[i][SeeAllIndex])); //instanciando novo usuario
        for(var j=0; j<headings.length; j++){
            if(j != fullnameIndex && j != eidIndex && j != fullnameIndex && j != InvisibleIndex && j != SeeAllIndex){
                var auxHeading = headings[j].split(' ');
                switch(auxHeading[0]){
                    case 'group':
                        auxGroups = mergedContent[i][j].split(/[\/,]/);
                        for(var k = 0; k< auxGroups.length; k++){
                            auxGroups[k] = auxGroups[k].trim();
                        }
                        user.addGroup(auxGroups);
                        break;
                    
                    case 'phone':
                        AddressAtributes = auxHeading.splice(1);
                        var validPhoneList = new Array();
                        var phoneStr = /\(?[0-9]{2}\)?\s?[0-9]{5}\-?[0-9]{4}/g;
                        validPhoneList = mergedContent[i][j].match(phoneStr);
                        if(validPhoneList != null){
                            for(var k = 0; k< validPhoneList.length; k++){
                                validPhoneList[k] = ddi.concat(validPhoneList[k].replace(/[^0-9]/g, ''));
                                user.addAddress(validPhoneList[k], 'phone', AddressAtributes);
                            }
                        }
                        break;
                    
                    case 'email':
                        AddressAtributes = auxHeading.splice(1);
                        var validEmailList = new Array();
                        var emailStr = /[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;
                        validEmailList = mergedContent[i][j].match(emailStr);
                        if(validEmailList != null){
                            for(var k = 0; k< validEmailList.length; k++){
                                user.addAddress(validEmailList[k], 'email', AddressAtributes);
                            }
                        }
                        break;
                }
            }    
        }
        
        listOfUsers.push(user);
    }
return listOfUsers
}

//===================================================================== main  =======================================================

var ddi = "55";

//leitura
var fs = require("fs");
var text = fs.readFileSync("./input.csv", "utf-8");
var textByLine = text.split("\r\n");
var textByBlocks = new Array();
textByLine.forEach(function(element){
    textByBlocks.push(CSVtoArray(element));
})

headings = textByBlocks[0];
content = textByBlocks.slice(1);

// recuperando indices relevantes
var eidIndex = headings.indexOf("eid");
var fullnameIndex = headings.indexOf("fullname");
var InvisibleIndex = headings.indexOf("invisible");
var SeeAllIndex = headings.indexOf("see_all");

content.sort(compareEID); //ordenando os registros pelo id do usuario, para facilitar o merge
mergedContent = mergeContent(headings, content); //metodo para juntar registros de usuarios repetidos na tabela

listOfUsers = generateListOfUsers(mergedContent); //gerando lista de usuarios a partir do conteudo da tabela apos o merge

//escrita do arquivo JSON
fs.writeFile('output.json', JSON.stringify(listOfUsers), (err) => {
    if (err) {
        throw err;
    }
});
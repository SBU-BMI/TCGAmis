console.log('gbmTissueImages')


gbmImgSearchCreate=function(){
    var y = {}
    y.urlService="https://script.google.com/macros/s/AKfycbw2mVxz70Axhe8As1iBN36F-YmH91c5A7Zx2_5nUqVO/dev"
    y.urlDir="https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.8.37.0/"
    y.fun={}
    // list files
    y.get=function(url,fun){
        if(!fun){fun=function(x){console.log(x)}}
        var funid = 'fun'+Math.random().toString().slice(2)
        this.fun[funid]=fun
        s = document.createElement('script')
        s.src = this.urlService+'?url='+url+'&callback=gbmImgSearch.fun.'+funid
        document.head.appendChild(s)
    }
    // list files
    y.img={ls:[],byLabel:{}}
    var imgLsUrl="https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.8.37.0/MANIFEST.txt"
    y.get(imgLsUrl,function(txt){
        y.img.ls=txt.split(/\n/g).filter(function(txti){return txti.match('TCGA-')}).map(function(x){return x.match(/TCGA.+/g)}).join().split(',')
        // index by label
        //y.img={}
        y.img.ls.forEach(function(x){
            var lb = x.match('TCGA-[^\-]+-[^\-]+')[0]
            if(!y.img.byLabel[lb]){y.img.byLabel[lb]=[]}
            y.img.byLabel[lb].push(x)
        })

    })

    // generic read text to table
    y.url2obj=function(url,funobj){
        y.get(url,function(txt){
            var dt = txt.split(/\n/g).map(function(x){
                return x.split(/\t/g)
            })
            dtobj={dt:{},altLabel:{},CDE_ID:{}} // data object
            var cde
            for(var j=0;j<dt[0].length;j++){
                dtobj.dt[dt[1][j]]=[]
                dtobj.altLabel[dt[1][j]]=dt[0][j]
                cde = dt[2][j].match(/\:(.*)$/)
                if(cde.length<2){cde[1]=undefined}
                dtobj.CDE_ID[dt[1][j]]=cde[1]
                for(var i =3;i<dt.length;i++){
                    dtobj.dt[dt[1][j]].push(dt[i][j])
                }
            }
            funobj(dtobj)
        })
    }


    // get patient data
    var clinicUrl="https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/biotab/clin/nationwidechildrens.org_clinical_patient_gbm.txt"
    y.clin={}
    y.url2obj(clinicUrl,function(x){
        y.clin=x
    })


    return y

}


if(!window.jQuery){ // load it first
    s = document.createElement('script')
    s.src = "https://code.jquery.com/jquery-2.1.3.min.js"
    s.onload=function(){
        gbmImgSearch = gbmImgSearchCreate()
    }
    document.head.appendChild(s)
} else {
    gbmImgSearch = gbmImgSearchCreate()
}
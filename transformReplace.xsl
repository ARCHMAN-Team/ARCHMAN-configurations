<xsl:stylesheet version="1.0"
   xmlns:xsl='http://www.w3.org/1999/XSL/Transform'
   xmlns:html="http://www.w3.org/1999/xhtml"
   xmlns:exsl="http://exslt.org/strings"
   exclude-result-prefixes="html exsl"
>

<xsl:param name="Xbaserealdir"/>
<xsl:param name="item"/>
<xsl:param name="basedir"/>
<xsl:param name="commentRenderDir"/>
  <xsl:variable name="SearchTermsIn">Enter Search terms</xsl:variable>

<xsl:param name="pageTitle" select="'NDLTD Document Archive'" />

<xsl:output method="html" oamit-xml-declaration="yes" encoding="UTF8"/>

<xsl:template name="htmlheader">
   <head>
      <xsl:variable name="dynamicTitleHtmlHeader">SimpleDL</xsl:variable>
       <title><xsl:value-of select="$dynamicTitleHtmlHeader"/></title>
      <!-- Google sign-in -->
      <script src="https://apis.google.com/js/platform.js?onload=renderLoginButton" async="async" defer="defer">;</script>
      <meta name="google-signin-client_id" content="198962743816-7sdscou4pllp182nesibfg9e1281jn6a.apps.googleusercontent.com"/>
      <!-- Material Design -->
<!--
      <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet"/>
      <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js">;</script>
-->
      <link href="{concat ($basedir, 'styles/material-components-web.min.css')}" rel="stylesheet"/>
      <script src="{concat ($basedir, 'styles/material-components-web.min.js')}">;</script>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"/>
      <!-- Slick carousel -->
      <link rel="stylesheet" type="text/css" href="{concat ($basedir, 'slick/slick.css')}"/>
      <link rel="stylesheet" type="text/css" href="{concat ($basedir, 'slick/slick-theme.css')}"/>
      <!-- SimpleDL js/css -->
      <script language="Javascript" src="{concat ($basedir, 'scripts/search.js')}">;</script>
      <script language="Javascript">
         var basedir = "<xsl:value-of select="$basedir"/>";
      </script>
      <script language="Javascript" src="{concat ($basedir, 'scripts/login.js')}">;</script>
      <link rel="stylesheet" title="mainstyle" type="text/css" href="{concat ($basedir, 'styles/style.css')}"/>
<!--      <meta http-equiv="Cache-Control" content="no-store"/>
      <meta http-equiv="Expires" content="0"/> -->
      <meta charset="UTF-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,400;0,700;1,400&amp;display=swap" rel="stylesheet"/>
   </head>
</xsl:template>

<xsl:template name="adminheader">

   <head>
     <xsl:variable name="dynamicTitle">Admin</xsl:variable>
       <title><xsl:value-of select="$dynamicTitle"/></title>
      <!-- Google sign-in -->
      <script src="https://apis.google.com/js/platform.js?onload=renderLoginButton" async="async" defer="defer">;</script>
      <meta name="google-signin-client_id" content="198962743816-7sdscou4pllp182nesibfg9e1281jn6a.apps.googleusercontent.com"/>
      <!-- Material Design -->
      <link href="{concat ($basedir, 'styles/material-components-web.min.css')}" rel="stylesheet"/>
      <script src="{concat ($basedir, 'styles/material-components-web.min.js')}">;</script>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"/>
      <!-- SimpleDL js/css -->
      <script language="Javascript" src="{concat ($basedir, 'scripts/search.js')}">;</script>
      <script language="Javascript">
         var basedir = "<xsl:value-of select="$basedir"/>";
      </script>
      <script language="Javascript" src="{concat ($basedir, 'scripts/login.js')}">;</script>
      <link rel="stylesheet" title="mainstyle" type="text/css" href="{concat ($basedir, 'styles/adminstyle.css')}"/>
   </head>
</xsl:template>

<xsl:template name="banner">
   <div class="banner">
   <xsl:variable name="imageFileName">docs.jpg</xsl:variable>
      <div class="banner-logo"><a href="{concat ($basedir, 'index.html')}"> <img src="{concat ($basedir, 'images/', $imageFileName)}"/></a></div>
      <div class="banner-logins">
       <xsl:variable name="banner-logIn">Login/Reg</xsl:variable>
         <div class="banner-login"><div id="login"><a href="{concat ($basedir, 'login.html')}" onClick="login1(this.href); return false"><xsl:value-of select="$banner-logIn"/></a></div></div>
      </div>
      <xsl:variable name="index">Home</xsl:variable>
      <xsl:variable name="about">About</xsl:variable>
      <xsl:variable name="users">Authors</xsl:variable>
      <xsl:variable name="search">Search</xsl:variable>
        <xsl:variable name="contact">Contact us</xsl:variable>
      <div class="banner-links">
         <a href="{concat ($basedir, 'index.html')}"><xsl:value-of select="$index"/></a> | 
         <a href="{concat ($basedir, 'about.html')}"><xsl:value-of select="$about"/></a> | 
         <a href="{concat ($basedir, 'users.html')}"><xsl:value-of select="$users"/></a> | 
         <a href="{concat ($basedir, 'search.html')}"><xsl:value-of select="$search"/></a> | 
         <a href="{concat ($basedir, 'contact.html')}"><xsl:value-of select="$contact"/></a></div>
   </div>
</xsl:template>

<xsl:template name="adminbanner">
   <div class="banner">
      <div class="banner-logo"><a href="{concat ($basedir, 'cgi-bin/manage.pl')}"><img src="{concat ($basedir, 'images/simpledl.png')}"/></a></div>
      <div class="banner-logins">
         <div class="banner-login"><div id="login"><a href="{concat ($basedir, 'login.html')}" onClick="login1(this.href); return false">Login / Register</a></div></div>
      </div>
      <xsl:variable name="indexAdminBanner">Site Home</xsl:variable>
      <div class="banner-links">
         <a href="{concat ($basedir, 'index.html')}"><xsl:value-of select="$indexAdminBanner"/></a>
      </div>
   </div>
</xsl:template>

<xsl:template match="adminheader">
   <html>
      <xsl:call-template name="adminheader"/>
      <body onLoad="checkCookies (); return false">
         <xsl:call-template name="adminbanner"/>
      </body></html>
</xsl:template>

<xsl:template match="header">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onLoad="checkCookies (); return false">
         <xsl:call-template name="banner"/>
      </body></html>
</xsl:template>

<xsl:template match="popupheader">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onLoad="checkCookies (); return false">
      </body></html>
</xsl:template>


<xsl:template name="searchpage">
   <xsl:param name="toplevel"/>
   <xsl:variable name="configfilename" select="concat ($Xbaserealdir, '/config/config.xml')"/>
   <xsl:variable name="configdocument" select="document($configfilename)/config/toplevel[@id=$toplevel]"/>
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onLoad="doSearch (''); checkCookies (); return false">
         <div class="content">
            <xsl:call-template name="banner"/>
            <xsl:choose>
               <xsl:when test="$toplevel='users'">
                   <h1>Authors</h1>
                   <p>List of contributors to collections (draft)</p>
               </xsl:when>
               <xsl:otherwise>
                <xsl:variable name="SearchResults">Search Results</xsl:variable>
                  <h1><xsl:value-of select="$SearchResults"/></h1>
               </xsl:otherwise>
            </xsl:choose> 
            <hr/>
            <div class="searchgrid">
               <div class="searchmenu">
<!--                  <h3>Search</h3> -->
                  <p><form name="searchform" method="post" action="#" onSubmit="doSearch (document.forms['searchform'].elements['searchbox'].value); return false">

                  <label class="mdc-text-field mdc-text-field--filled searchbox2class">
                     <span class="mdc-text-field__ripple"></span>
                     <input class="mdc-text-field__input" name="searchbox" id="searchbox" type="text" aria-labelledby="searchbox"/>
                    
                     <span class="mdc-floating-label" id="searchbox"><xsl:value-of select="$SearchTermsIn"/></span>
                     <span class="mdc-line-ripple"></span>
                  </label>
                  <script>
                     mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
                  </script>
                  <script>
                     var toplevel = '<xsl:value-of select="$toplevel"/>';
                     if (document.forms['searchform'].elements['searchbox'].value == '')
                     {
                        var fields = window.location.href.split('query=');
                        if (fields.length == 2)
                         { 
                            fields[1] = fields[1].replace (/%20/, " ");
                            document.forms['searchform'].elements['searchbox'].value = fields[1]; 
                         }
                     }
                  </script>

                  <!-- facet display -->
                  <xsl:for-each select="$configdocument/field_browse/field">
                     <xsl:variable name="valuesfilename" select="concat ($Xbaserealdir, '/indices/', $toplevel, '/browse/1/', id, '/index.xml')"/>
                     <xsl:variable name="valuesdocument" select="document($valuesfilename)"/>
                     <h3><xsl:value-of select="name"/></h3>
                     <p><select name="{concat ('field_browse_', id)}" style="width: 100%"
                     onChange="doSearch (); return false">
                        <option value="all">All</option>
                        <xsl:for-each select="$valuesdocument/index/entry">
                           <option value="{@id}"><xsl:value-of select="."/></option>
                        </xsl:for-each>
                     </select></p>
                  </xsl:for-each>

                  <!-- choose sort order -->
                  <h3>Arrange by...</h3>
                  <p><select name="sort" style="width: 100%" onChange="doSearch (); return false">
                  <xsl:for-each select="$configdocument/field_sort/field">
                     <option value="{.}"><xsl:value-of select="."/></option>
                  </xsl:for-each>
                  </select></p>

                  <!-- choose index -->
                  <xsl:choose>
                     <xsl:when test="count($configdocument/field_index/index)=1">
                        <input type="hidden" name="index" value="1"/>
                     </xsl:when>
                     <xsl:otherwise>
                        <h3>Search through...</h3>
                        <xsl:for-each select="$configdocument/field_index/index">
                           <xsl:choose>
                              <xsl:when test="position()=1">
                                 <input type="radio" name="index" value="{id}" onChange="doSearch (); return false" checked="true"/>
                              </xsl:when> 
                              <xsl:otherwise>
                                 <input type="radio" name="index" value="{id}" onChange="doSearch (); return false"/>
                              </xsl:otherwise> 
                           </xsl:choose>
                           <xsl:value-of select="name"/><br/>
                        </xsl:for-each>
                     </xsl:otherwise>
                  </xsl:choose>

                  </form></p>
               </div>
               <div class="searchresults">
                  <h3>
                     <xsl:choose>
                        <xsl:when test="$toplevel = 'users'">List of Authors</xsl:when>
                        <xsl:otherwise>Results</xsl:otherwise>
                     </xsl:choose>
                  </h3>
                  <form name="pager" action="#" onSubmit="return false">
                  <div class="searchnav">
                  <div class="searchnav1">
                  Showing <span id="resultsstart">0</span> to <span id="resultsend">0</span> of <span id="numberofresults">0</span> results
                  </div>
                  <div class="searchnav2">
                  Page: <a href="" onClick="prevPage(); return false">&#171;</a>
                  <input type="text" name="pagenumber" value="1" onChange="displayPage()"/> 
                  <a href="" onClick="nextPage(); return false">&#187;</a> 
                  &#160;&#160;
                  <xsl:variable name="resultsperpage">
                     <xsl:choose>
                        <xsl:when test="$toplevel = 'users'">50</xsl:when>
                        <xsl:otherwise>20</xsl:otherwise>
                     </xsl:choose>
                  </xsl:variable>
                  Results per page: <input type="text" name="resultsperpage" value="{$resultsperpage}" onChange="displayPage ()"/> 
                  </div>
                  </div>
                  </form>
                  <div id="resultlist"></div>
               </div>
            </div>
         </div>
      </body>
   </html>
</xsl:template>

<xsl:template match="search">
   <xsl:call-template name="searchpage">
      <xsl:with-param name="toplevel">main</xsl:with-param>
   </xsl:call-template>
</xsl:template>

<xsl:template match="users">
   <xsl:call-template name="searchpage">
      <xsl:with-param name="toplevel">users</xsl:with-param>
   </xsl:call-template>
</xsl:template>


<xsl:template match="index">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onunload="" onLoad="checkCookies ()">
         <xsl:call-template name="banner"/>

         <div class="content">

<!--
         <div class="carouselsection linesection">
            <link rel="stylesheet" type="text/css" href="{concat ($basedir, 'carousel/carousel.css')}"/>
            <div class="carousel">
               <section class="slider-top slider" id="indexcarousel">
               </section>
            </div>
            <script type="text/javascript" src="jquery/jquery-1.11.0.min.js"></script>
            <script type="text/javascript" src="jquery/jquery-migrate-1.2.1.min.js"></script>
            <script type="text/javascript" src="slick/slick.min.js"></script>
            <script type="text/javascript">
               loadCarousel ();    
               $(document).ready(function(){
                $('.slider-top').slick({
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: true,
                  fade: true,
                  adaptiveHeight: true,
                  dots: true,
                  infinite: true,
                  autoplay: true,
                  autoplayspeed: 2000
               });})
            </script>
         </div>
-->
         <div class="searchsection linesection">
           <xsl:variable name="SearchHeading">Search</xsl:variable>
            <h1><xsl:value-of select="$SearchHeading"/></h1>
            <form name="searchform" class="searchformclass" method="post" action="#" onSubmit="frontPageSearch (document.forms['searchform'].elements['searchbox'].value); return false">
               <label class="mdc-text-field mdc-text-field--filled searchboxclass">
                  <span class="mdc-text-field__ripple"></span>
                  <input class="mdc-text-field__input" id="searchbox" type="text" aria-labelledby="searchbox"/>
                
                  <span class="mdc-floating-label" id="searchbox"><xsl:value-of select="$SearchTermsIn"/></span>
                  <span class="mdc-line-ripple"></span>
               </label>
               <button class="searchbuttonclass mdc-button mdc-button--raised" type="submit">
                  <span class="mdc-button__label">Go</span>
               </button>
            </form>
         </div>
          
         <script>
            mdc.ripple.MDCRipple.attachTo(document.querySelector('.searchbuttonclass'));
            mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
         </script>

<!--
         <div class="browsesection linesection archival_curations">
            <h1>Browse FHYA Presentations</h1>
            <xsl:variable name="collectionsfilename" select="concat ($Xbaserealdir, '/metadata/Presentations/index.xml')"/>
            <xsl:variable name="collectionsdocument" select="document($collectionsfilename)/collection"/>
            <xsl:for-each select="$collectionsdocument/item">
               <xsl:variable name="collectionfilename" select="concat ($Xbaserealdir, '/metadata/Presentations/', ., '/metadata.xml')"/>
               <xsl:variable name="collectiondocument" select="document(exsl:encode-uri ($collectionfilename, false()))/item"/>

               <xsl:variable name="extension" select="substring ($collectiondocument/digitalObjectURI, string-length ($collectiondocument/digitalObjectURI)-3)"/>
               <xsl:variable name="protocol" select="substring ($collectiondocument/digitalObjectURI, 1, 4)"/>

               <xsl:variable name="link">
                  <xsl:choose>
                     <xsl:when test="$extension = '.zip'">
                        <xsl:value-of select="concat ($basedir, 'cgi-bin/view/', $collectiondocument/digitalObjectURI, '/')"/>
                     </xsl:when>
                     <xsl:when test="$protocol = 'http'">
                        <xsl:value-of select="$collectiondocument/digitalObjectURI"/>
                     </xsl:when>
                     <xsl:otherwise>
                        <xsl:value-of select="concat ($basedir, $collectiondocument/digitalObjectURI, '/index.html')"/>
                     </xsl:otherwise>
                  </xsl:choose>
               </xsl:variable>

               <div class="collectionbox">
                  <a href="{$link}">
                  <div class="collectionimage">
                     <img src="{concat($basedir, 'thumbs/', $collectiondocument/view/file, '.jpg')}" alt="{$collectiondocument/title}"/>
                  </div>
                  <div class="collectiontitle">
                     <xsl:value-of select="$collectiondocument/title"/>
                  </div>
                  </a>
               </div>
            </xsl:for-each>
         </div>
-->
         <div class="browsesection linesection">
         <xsl:variable name="BrowseCollectionsHeading">Collection</xsl:variable>
            <h1><xsl:value-of select="$BrowseCollectionsHeading"/></h1>
            <xsl:variable name="collectionsfilename" select="concat ($Xbaserealdir, '/metadata/index.xml')"/>
            <xsl:variable name="collectionsdocument" select="document($collectionsfilename)/collection"/>
            <xsl:for-each select="$collectionsdocument/item">
               <xsl:if test=". != 'FHYA Depot' and . != 'Public Depot'">
                  <xsl:variable name="collectionfilename" select="concat ($Xbaserealdir, '/metadata/', ., '/metadata.xml')"/>
                  <xsl:variable name="collectiondocument" select="document(exsl:encode-uri ($collectionfilename, false()))/item"/>
                  <div class="collectionbox">
                     <a href="{concat ('metadata/', $collectiondocument/legacyId, '/index.html')}">
                     <div class="collectionimage">
                        <img src="{concat($basedir, 'thumbs/', $collectiondocument/view/file, '.jpg')}" alt="{$collectiondocument/legacyId}"/>
                     </div>
                     <div class="collectiontitle">
                        <xsl:value-of select="$collectiondocument/title"/>
                     </div>
                     </a>
                  </div>
               </xsl:if>
            </xsl:for-each>
         </div>
<!--
         <div class="browsesection linesection">
            <h1>Browse Depot</h1>
            <xsl:variable name="collectionfilename" select="concat ($Xbaserealdir, '/metadata/FHYA Depot/metadata.xml')"/>
            <xsl:variable name="collectiondocument" select="document(exsl:encode-uri ($collectionfilename, false()))/item"/>
            <div class="collectionbox">
               <a href="metadata/FHYA Depot/index.html">
                  <div class="collectionimage">
                     <img src="{concat($basedir, 'thumbs/', $collectiondocument/view/file, '.jpg')}" alt="FHYA Depot"/>
                  </div>
                  <div class="collectiontitle">
                     FHYA Depot
                  </div>
               </a>
            </div>
            <xsl:variable name="collectionfilename2" select="concat ($Xbaserealdir, '/metadata/Public Depot/metadata.xml')"/>
            <xsl:variable name="collectiondocument2" select="document(exsl:encode-uri ($collectionfilename2, false()))/item"/>
            <div class="collectionbox">
               <a href="metadata/Public Depot/index.html">
                  <div class="collectionimage">
                     <img src="{concat($basedir, 'thumbs/', $collectiondocument2/view/file, '.jpg')}" alt="Public Depot"/>
                  </div>
                  <div class="collectiontitle">
                     Public Depot
                  </div>
               </a>
            </div>
         </div>

         <div class="submitsection linesection" id="submitsection">
            <h1>Submit</h1>
            <p>Contribute a resource to FHYA for inclusion in Depot</p>
            <ul>
               <li><a href="submit.html">Submit your resource</a></li>
            </ul>
         </div>
-->
<!--         <div class="managesection linesection" id="managesection">
            <h1>Manage Archive</h1>
            <p>Manage content contained in the archive.</p>
            <ul>
               <li><a href="cgi-bin/moderate.pl">Moderate requests</a> <span id="outstanding"></span></li>
               <li><a href="cgi-bin/manage.pl">Manage collections/spreadsheets</a></li>
            </ul>
         </div>
-->

         <div class="aboutfhya linesection">
           <xsl:variable name="AboutHeading">About Collection</xsl:variable>
            <h1><xsl:value-of select="$AboutHeading"/></h1>

           <xsl:variable name="AboutDesc">is a collection of research papers, presentations and related files from the year symposia of the I'm happy to be part of the evaluation.</xsl:variable>

           

            <p> <xsl:value-of select="$AboutDesc"/><a href="http://www.ndltd.org/"> Networked Digital Library of Theses and
            Dissertations</a>.</p>

            <p>It is hosted on an instance of Simple DL.</p>
         </div>
         
         </div>
      </body>
   </html>
</xsl:template>

<xsl:template match="collection">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onunload="" onLoad="checkCookies ()">
         <xsl:call-template name="banner"/>
         <div class="content">
         <div class="breadcrumbs">
            <div class="breadcrumb"><a href="{concat ($basedir, 'index.html')}">Home</a>
               <xsl:call-template name="bc">
                  <xsl:with-param name="crumb" select="$item"/>
                  <xsl:with-param name="base" select="substring-after ($basedir, '/')"/>
                  <xsl:with-param name="item" select="$item"/>
               </xsl:call-template>
            </div>
         </div>
            <xsl:variable name="metadatafilename" select="concat ($Xbaserealdir,
                          '/metadata/', $item, '/', '/metadata.xml')"/>
            <xsl:variable name="metadatadocument" select="document(exsl:encode-uri ($metadatafilename, false()))"/>

            <xsl:if test="$metadatadocument/item/title">
               <h1>
                  <xsl:value-of select="$metadatadocument/item/title"/>
               </h1>
            </xsl:if>

            <xsl:if test="$metadatadocument/item/title and (level &gt; 1)">
               <xsl:apply-templates select="$metadatadocument/item" mode="image"/> 
            </xsl:if>

            <xsl:variable name="metadatadiv">
               <xsl:choose>
                  <xsl:when test="item">metadatapanehalf</xsl:when>
                  <xsl:otherwise>metadatapanefull</xsl:otherwise>
               </xsl:choose>
            </xsl:variable>
            
            <xsl:if test="$metadatadocument/item/title">
               <div class="{$metadatadiv}">
                  <xsl:if test="$metadatadocument/item/scopeAndContent">
                     <xsl:apply-templates select="$metadatadocument/item" mode="scope"/>
                  </xsl:if>
                  <xsl:apply-templates select="$metadatadocument/item" mode="metadata"/>
               </div>
            </xsl:if>

            <xsl:if test="item">
               <div class="contentpane">
               <h2>Contents</h2>
               <xsl:if test="starts-with ($item, 'FHYA Depot')">
                  <h4>Sort by: Title&#160;<a onClick="divSort('sortablelist',0,1)">&#8593;</a>
                                          <a onClick="divSort('sortablelist',0,2)">&#8595;</a>
                               | Maker and Shaper&#160;<a onClick="divSort('sortablelist',1,1)">&#8593;</a>
                                          <a onClick="divSort('sortablelist',1,2)">&#8595;</a>
                  </h4>
               </xsl:if>
               <div id="sortablelist">
                  <xsl:for-each select="item">
                     <xsl:variable name="docfilename" select="concat ($Xbaserealdir,
                                   '/metadata/', $item, '/', ., '/metadata.xml')"/>
                     <xsl:variable name="itemdocument" select="document(exsl:encode-uri ($docfilename, false()))"/>
                     <xsl:variable name="link" select="concat (., '/index.html')"/>
                        <xsl:choose>
                           <xsl:when test="@type='item'">
                              <div class="contentitem">
                              <div class="contentitemthumb">
                                 <xsl:if test="$itemdocument/item/view[1]">
                                    <a href="{$link}"><img src="{concat ($basedir, 'thumbs/', $itemdocument/item/view[1]/file, '.jpg')}"/></a>
                                 </xsl:if>
                              </div>
                              <div class="contentitemtext">
                                 <p><b>Title: </b> <a href="{$link}"><span><xsl:value-of select="$itemdocument/item/title"/></span></a></p>
                                 <xsl:if test="starts-with ($item, 'FHYA Depot')">
                                    <p>
                                       <xsl:for-each select="$itemdocument/item/event[eventType='Writing' or eventType='Editing']">
                                          <b><xsl:value-of select="eventType"/>: </b> <span><xsl:value-of select="eventActor"/></span>
                                          <br/>
                                       </xsl:for-each>
                                    </p>
                                 </xsl:if>
                                 <xsl:if test="$itemdocument/item/creator">
                                    <p>
                                       <b>Authors: </b> 
                                       <xsl:for-each select="$itemdocument/item/creator">
                                          <xsl:value-of select="."/>
                                          <xsl:if test="position () != last()">, </xsl:if>
                                       </xsl:for-each>
                                    </p>
                                 </xsl:if>
                                 <span></span>
                              </div>                           
                              </div>
                           </xsl:when>
                           <xsl:when test="@type='file'">
                              <div class="contentitem">
                              <div class="contentitemthumb">
                                 <a href="{$link}"><img src="{concat (., '/thumbnail.jpg')}"/></a>
                              </div>
                              <div class="contentitemtext">
                                 <p><b>File: </b> <a href="{$link}"><span><xsl:value-of select="$itemdocument/item/title"/></span></a></p>
                                 <span></span> 
                              </div>
                              </div>
                              <br/>
                           </xsl:when>
                           <xsl:otherwise>
                              <div class="contentitem">
                              <div class="contentitemtext">
                              <b>
                                 <xsl:choose>
                                    <xsl:when test="@type='series'">Series: </xsl:when>
                                    <xsl:when test="@type='subseries'">Subseries: </xsl:when>
                                    <xsl:when test="@type='selection'">Selection: </xsl:when>
                                 </xsl:choose> 
                              </b>
                              <a href="{$link}">
                                 <span><xsl:value-of select="$itemdocument/item/title"/></span>
                              </a>
                              <span></span>
                              </div>
                              </div>
                           </xsl:otherwise>
                        </xsl:choose>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
<!--            <xsl:variable name="metadatafilename" select="concat ($Xbaserealdir,
                          '/metadata/', $item, '/', '/metadata.xml')"/>
            <xsl:variable name="metadatadocument" select="document(exsl:encode-uri ($metadatafilename, false()))"/>
-->
<!--
            <xsl:if test="$metadatadocument/item/title and (level &gt; 1)">
               <xsl:apply-templates select="$metadatadocument/item" mode="comments"/>
            </xsl:if>
-->
         </div>
      </body>
   </html>
</xsl:template>

<xsl:template name="bc">
   <xsl:param name="crumb"/>
   <xsl:param name="base"/>
   <xsl:param name="item"/>
<!-- DEBUG  Crumb <xsl:value-of select="$crumb"/> Base <xsl:value-of select="$base"/> -->
   <div class="breadcrumb"><div class="bcsep">&#x21b3;</div>
      <xsl:variable name="docfilename" select="concat ($Xbaserealdir,
         '/metadata/', $item, '/', substring-after ($base, '/'), 'metadata.xml')"/>
      <xsl:variable name="itemdocument" select="document(exsl:encode-uri ($docfilename, false()))"/>
      <div class="bctext">
         <a href="{concat (substring-after ($base, '/'), 'index.html')}">
            <xsl:choose>
               <xsl:when test="$itemdocument/item/title"><xsl:value-of select="$itemdocument/item/title"/></xsl:when>
               <xsl:otherwise>
                  <xsl:value-of select="substring-before ($crumb, '/')"/>
               </xsl:otherwise>
            </xsl:choose>
         </a>
      </div>
      <xsl:if test="substring-after ($crumb, '/')">
         <xsl:call-template name="bc">
            <xsl:with-param name="crumb" select="substring-after ($crumb, '/')"/>
            <xsl:with-param name="base" select="substring-after ($base, '/')"/>
            <xsl:with-param name="item" select="$item"/>
         </xsl:call-template>
      </xsl:if>
   </div>
</xsl:template>

<xsl:template match="item" mode="image">
   <xsl:variable name="extension" select="substring (view/file, string-length (view/file)-3)"/>
         <xsl:if test="view">
            <div class="imagepane">

            <xsl:choose>
               <xsl:when test="$extension = '.zip'">
                  <h2>Links</h2>
               </xsl:when>
               <xsl:otherwise>
                  <h2>Content</h2>
               </xsl:otherwise>
            </xsl:choose>

            <xsl:choose>               
               <xsl:when test="$extension = '.zip'">
                  <div class="doubleimageframe"><a href="{concat ($basedir, 'cgi-bin/view/', view/file, '/')}">
                     <img class="doubleimage" src="{concat ($basedir, 'images/view.png')}" alt="{view/title}"/></a>
                     <a href="{concat ($basedir, '../collection/', view/file)}">
                     <img class="doubleimage" src="{concat ($basedir, 'images/download.png')}" alt="{view/title}"/></a>
                  </div>
               </xsl:when>
               <xsl:when test="view[2]">
                  <div class="carousel">
                     <section class="slider-top slider">
                        <xsl:for-each select="view">
                           <div><a href="{concat ($basedir, 'collection/', file)}">
                              <img src="{concat ($basedir, 'thumbs/', file, '.jpg')}" alt="{title}"/></a>
                           </div>
                        </xsl:for-each>
                     </section>
                     <section class="slider-nav slider">
                        <xsl:for-each select="view">
                           <div><img src="{concat ($basedir, 'thumbs/', file, '.jpg')}" alt="{title}"/></div>
                        </xsl:for-each>
                     </section>
                  </div>

                  <script type="text/javascript" src="{concat ($basedir, 'jquery/jquery-1.11.0.min.js')}"></script>
                  <script type="text/javascript" src="{concat ($basedir, 'jquery/jquery-migrate-1.2.1.min.js')}"></script>
                  <script type="text/javascript" src="{concat ($basedir, 'slick/slick.min.js')}"></script>

                  <script type="text/javascript">
                    $(document).ready(function(){
                    $('.slider-top').slick({
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: false,
                      fade: true,
                      asNavFor: '.slider-nav'
                   });
                   $('.slider-nav').slick({
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      asNavFor: '.slider-top',
                      dots: true,
                      centerMode: true,
                      focusOnSelect: true
                   });
                    });
                  </script>
               </xsl:when>
               <xsl:otherwise>
                  <div class="singleimageframe"><a href="{concat ($basedir, 'collection/', view/file)}">
                     <img class="singleimage" src="{concat ($basedir, 'thumbs/', view/file, '.jpg')}" alt="{view/title}"/></a>
                  </div>
               </xsl:otherwise>
            </xsl:choose>
            </div>
         </xsl:if>
</xsl:template>

<xsl:template match="item" mode="scope">
   <xsl:if test="scopeAndContent">
      <h2>Scope and Content</h2>
      <div class="scope">
         <xsl:for-each select="scopeAndContent">
            <p><xsl:value-of select="."/></p>
         </xsl:for-each>
      </div>
   </xsl:if>
</xsl:template>

<xsl:template match="item" mode="metadata">
         <h2>Metadata</h2>
            <xsl:if test="title">
               <div class="metadataField">
               <div class="metadataHeading">Title</div>
               <div class="metadataValue">
                  <xsl:for-each select="title">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>

               <xsl:if test="radTitleSourceOfTitleProper">
               <div class="metadataValue">
                  <xsl:for-each select="radTitleSourceOfTitleProper">
                     <p>[ Source of title : <xsl:value-of select="."/> ]</p>
                  </xsl:for-each>
               </div>
               </xsl:if>

               </div>
            </xsl:if>
            <xsl:if test="creator">
               <div class="metadataField">
               <div class="metadataHeading">Author</div>
               <div class="metadataValue">
                  <xsl:for-each select="creator">
                     <p>
                        <a href="{concat ($basedir, 'users/', @id, '.html')}"><xsl:value-of select="."/></a>
                     </p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="description">
               <div class="metadataField">
               <div class="metadataHeading">Description</div>
               <div class="metadataValue">
                  <xsl:for-each select="description">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="date">
               <div class="metadataField">
               <div class="metadataHeading">Date</div>
               <div class="metadataValue">
                  <xsl:for-each select="date">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="radGeneralMaterialDesignation">
               <div class="metadataField">
               <div class="metadataHeading">Material Designation</div>
               <div class="metadataValue">
                  <xsl:for-each select="radGeneralMaterialDesignation">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
<!--            <xsl:if test="radTitleSourceOfTitleProper">
               <div class="metadataField">
               <div class="metadataHeading">Source of title</div>
               <div class="metadataValue">
                  <xsl:for-each select="radTitleSourceOfTitleProper">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if> -->
            <xsl:if test="repository">
               <div class="metadataField">
               <div class="metadataHeading">Repository</div>
               <div class="metadataValue">
                  <xsl:for-each select="repository">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="identifier">
               <div class="metadataField">
               <div class="metadataHeading">Identifier</div>
               <div class="metadataValue">
                  <xsl:for-each select="identifier">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
<!--            <xsl:if test="scopeAndContent">
               <div class="metadataField">
               <div class="metadataHeading">Scope and Content</div>
               <div class="metadataValue">
                  <xsl:for-each select="scopeAndContent">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if> -->
            <xsl:if test="arrangement">
               <div class="metadataField">
               <div class="metadataHeading">Arrangement</div>
               <div class="metadataValue">
                  <xsl:for-each select="arrangement">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="reproductionConditions">
               <div class="metadataField">
               <div class="metadataHeading">Reproduction Conditions</div>
               <div class="metadataValue">
                  <xsl:for-each select="reproductionConditions">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="generalNote">
               <div class="metadataField">
               <div class="metadataHeading">Descriptions and Notes</div>
               <div class="metadataValue">
                  <xsl:for-each select="generalNote">
                     <p><xsl:value-of select="."/></p>
                  </xsl:for-each>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="event">
               <div class="metadataField">
               <div class="metadataHeading">Events</div>
               <div class="metadataValue">
                  <table>
                     <tr><th>Event Actor</th><th>Event Type</th><th>Event Date</th><th>Event Description</th></tr>
                     <xsl:for-each select="event">
                        <tr>
                           <td class="eventActor"><a href="{concat ($basedir, 'users/', eventActor/@id, '.html')}"><xsl:value-of select="eventActor"/></a></td>
                           <td class="eventType"><xsl:value-of select="eventType"/></td>
                           <td class="eventDate"><xsl:value-of select="eventDate"/></td>
                           <td class="eventDescription"><xsl:value-of select="eventDescription"/></td>
                        </tr>
                     </xsl:for-each>
                  </table>
               </div>
               </div>
            </xsl:if>
            <xsl:if test="relatedUnitsOfDescription">
               <div class="metadataField">
               <div class="metadataHeading">Related Items</div>
               <div class="metadataValue">
               <xsl:for-each select="relatedUnitsOfDescription">
                  <xsl:variable name="docfilename" select="concat ($Xbaserealdir, '/', ., '/metadata.xml')"/>
                  <xsl:variable name="link" select="concat ($basedir, ., '/index.html')"/>
                  <xsl:variable name="itemdocument" select="document(exsl:encode-uri ($docfilename, false()))"/>
                  <xsl:if test="$itemdocument/item/view">
                     <table><tr><td>
                       <a href="{$link}">
                         <img src="{concat ($basedir, 'thumbs/', $itemdocument/item/view[1]/file, '.jpg')}"/>
                       </a>
                     <br/><xsl:value-of select="$itemdocument/item/view[1]/title"/>
                     </td></tr></table>
                  </xsl:if>
               </xsl:for-each>
               </div>
               </div>
            </xsl:if>
</xsl:template>

<xsl:template match="item" mode="comments">
   <div class="commentpane">
            <!-- Comments -->
            <xsl:variable name="commentsfilename" select="concat ($commentRenderDir, '/', $item, '/metadata.xml')"/>
            <xsl:variable name="commentsdocument" select="document(exsl:encode-uri ($commentsfilename, false()))"/>
            <h2>Contributions</h2>
            <xsl:if test="$commentsdocument/comments/comment">
               <xsl:for-each select="$commentsdocument/comments/comment">
                  <div class="acomment">
                     <div class="commentname">
                        Name: <a href="{concat ($basedir, 'users/', userID, '.html')}"><xsl:value-of select="name"/></a>
                     </div>
                     <div class="commentdate">Date: <xsl:value-of select="date"/></div>
                     <div class="commentcontent"><xsl:value-of select="content"/></div>
                     <xsl:if test="attachment">
                        <xsl:variable name="attachfilename" select="concat ($Xbaserealdir, '/metadata/', attachment, '/metadata.xml')"/>
                        <xsl:variable name="attachdocument" select="document(exsl:encode-uri ($attachfilename, false ()))"/>
                        <div class="commentattachment">
                           <div class="commentattachment1">
                              <p><h4>Attached File:</h4></p>
                              <p><a href="{concat ($basedir, 'metadata/', attachment, '/index.html')}"><xsl:value-of select="$attachdocument/item/title"/></a></p>
                           </div>
                           <div class="commentattachment2">
                              <xsl:if test="$attachdocument/item/view">
                                 <table><tr><td>
                                    <a href="{concat ($basedir, 'metadata/', attachment, '/index.html')}">
                                       <img src="{concat ($basedir, 'thumbs/', $attachdocument/item/view[1]/file, '.jpg')}"/>
                                    </a>
                                 <!-- <br/><xsl:value-of select="$itemdocument/item/view[1]/title"/> -->
                                 </td></tr></table>
                              </xsl:if>
                           </div>
                        </div>
                     </xsl:if>
                  </div>
               </xsl:for-each>
            </xsl:if>

            <script>
               makeBreaks ();
            </script>

         <div class="addcomment" id="addcomment">
         <form id="mdform" name="addcommentform" class="addcommentformclass" enctype="multipart/form-data"
          method="post" action="{concat ($basedir, 'cgi-bin/add.pl')}">
            <input type="hidden" name="item" value="{$item}"/>
            <input type="hidden" name="url" id="addcommentformurl" value=""/>
            <input type="hidden" name="user" id="addcommentformuser" value=""/>
            <input type="hidden" name="userID" id="addcommentformuserID" value=""/>
            <p>
            <div class="mdc-text-field mdc-text-field--textarea addcommentboxclass">
               <textarea id="commentbox" name="commentbox" class="mdc-text-field__input" rows="8" cols="80"></textarea>
               <div class="mdc-notched-outline">
                  <div class="mdc-notched-outline__leading"></div>
                  <div class="mdc-notched-outline__notch">
                     <label for="textarea" class="mdc-floating-label">Enter your contribution</label>
                  </div>
                  <div class="mdc-notched-outline__trailing"></div>
               </div>
            </div>
            </p>
            <div id="cabox">

               <h4>Attachment - added to contribution</h4>
               <p>
                  <label class="mdc-button mdc-button--outlined mdc-js-button">
                     <i class="material-icons mdc-button__icon" aria-hidden="true">attach_file</i>
                     Select a file to attach: <input type="file" id="cafile" name="cafile"/>
                  </label>
               </p>

               <h4>Metadata</h4>

               <div id="formcontents"></div>

               <input type="hidden" id="fullmetadata" name="fullmetadata" value=""/>
<!--               <button class="addcomment-button mdc-button mdc-button-raised" type="submit" onClick="createMetadata (); return true"><span class="mdc-button__label">Submit contribution and attachment</span></button>
-->
            </div>
            
            <p>
               <button class="addcomment-button mdc-button mdc-button--raised" type="submit" onClick="return submitMetadata ()">
                  <span class="mdc-button__label" id="addcomment-button">Submit contribution</span>
               </button>
               <button class="addcomment-button2 mdc-button mdc-button--outlined" type="button"
                onClick="toggleAttachment(); return false" id="addcomment-button2">
                  <i class="material-icons mdc-button__icon" aria-hidden="true">attachment</i>
                  <span class="mdc-button__label">Attach File</span>
               </button>
            </p>

         </form>
         </div>

         <script>
            mdc.ripple.MDCRipple.attachTo(document.querySelector('.addcomment-button'));
            mdc.ripple.MDCRipple.attachTo(document.querySelector('.addcomment-button2'));
            mdc.textField.MDCTextField.attachTo(document.querySelector('.addcommentboxclass'));
            document.getElementById('addcommentformurl').value = document.location.href;
            document.getElementById('cabox').style = "display: none";
            config = loadXML ("/config/upload.xml");
            createForm ();
         </script>

         <div class="addcommentoff" id="addcommentoff">
         Login using the Login/Register buttn (top-right of page) to add a contribution.
         </div>
   </div>
</xsl:template>

<xsl:template match="submit">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onunload="" onLoad="checkCookies ()">
         <xsl:call-template name="banner"/>
         <div class="content">
         <h1>Submit a new contributed item</h1>

         <p>Please fill in the details of the file you are submitting.  More detail will make it easier to find your
         contribution.  If you are uploading a text document, a searchable PDF is preferred.  Use the + button to add 
         more fields where needed - for example, multiple authors should be added into multiple
         fields.  Fields marked with a star are required.</p>

         <div class="addcomment" id="addcomment">

         <form id="mdform" name="addcommentform" class="addcommentformclass" enctype="multipart/form-data"
          method="post" action="{concat ($basedir, 'cgi-bin/add.pl')}">
            <input type="hidden" name="url" id="addcommentformurl" value=""/>
            <input type="hidden" name="user" id="addcommentformuser" value=""/>
            <input type="hidden" name="userID" id="addcommentformuserID" value=""/>
            <div id="cabox">

               <h4>Resource to upload</h4>
               <p>
                  <label class="mdc-button mdc-button--outlined mdc-js-button">
                     <i class="material-icons mdc-button__icon" aria-hidden="true">attach_file</i>
                     Select a file to attach: <input type="file" id="cafile" name="cafile"/>
                  </label>

               </p>

               <h4>Metadata</h4>

               <div id="formcontents"></div>

               <input type="hidden" id="fullmetadata" name="fullmetadata" value=""/>
               <button class="addcomment-button mdc-button mdc-button--raised" type="submit" onClick="return submitMetadata ()"><span class="mdc-button__label">Submit contribution</span></button>

            </div>
         </form>
         </div>

         <script>
            mdc.ripple.MDCRipple.attachTo(document.querySelector('.addcomment-button'));
            document.getElementById('addcommentformurl').value = document.location.href;
            config = loadXML ("config/upload.xml");
            createForm ();
         </script>

         <div class="addcommentoff" id="addcommentoff">
         Login using the Google Signin button (top-right of page) to add a comment.
         </div>

         </div>
      </body>
   </html>
</xsl:template>

<xsl:template match="user">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onunload="" onLoad="checkCookies ()">
         <xsl:call-template name="banner"/>
         <div class="content">

         <h1>Author Profile</h1>

         <div class="metadatapanehalf">
            <h2>Details</h2>
            <xsl:if test="name">
               <div class="metadataField">
               <div class="metadataHeading">Name</div>
               <div class="metadataValue"><xsl:value-of select="name"/></div>
               </div>
            </xsl:if>
<!--
            <xsl:if test="authorizedFormOfName">
               <div class="metadataField">
               <div class="metadataHeading">Authorised Form of Name</div>
               <div class="metadataValue"><xsl:value-of select="authorizedFormOfName"/></div>
               </div>
            </xsl:if>
-->
<!--            <xsl:if test="type">
               <div class="metadataField">
               <div class="metadataHeading">Type</div>
               <div class="metadataValue"><xsl:value-of select="type"/></div>
               </div>
            </xsl:if>
-->            <xsl:if test="datesOfExistence">
               <div class="metadataField">
               <div class="metadataHeading">Dates of Existence</div>
               <div class="metadataValue"><xsl:value-of select="datesOfExistence"/></div>
               </div>
            </xsl:if>
            <xsl:if test="history">
               <div class="metadataField">
               <div class="metadataHeading">History</div>
               <div class="metadataValue"><xsl:value-of select="history"/></div>
               </div>
            </xsl:if>
            <xsl:if test="profile">
               <div class="metadataField">
                  <div class="metadataHeading">Profile</div>
                  <div class="metadataValue profilecontent"><xsl:value-of select="profile"/></div>
               </div>
            </xsl:if>
         </div>

         <div class="contentpane">
            <h2>Activity</h2>
            <table id="useractivitytable">
               <tr>
                  <th>Type&#160;<a onClick="tableSort('useractivitytable',0,1)">&#8593;</a>
                     <a onClick="tableSort('useractivitytable',0,2)">&#8595;</a></th>
                  <th>Date&#160;<a onClick="tableSort('useractivitytable',1,1)">&#8593;</a>
                     <a onClick="tableSort('useractivitytable',1,2)">&#8595;</a></th>
                  <th>Item&#160;<a onClick="tableSort('useractivitytable',2,1)">&#8593;</a>
                     <a onClick="tableSort('useractivitytable',2,2)">&#8595;</a></th>
               </tr>
               <xsl:for-each select="comment|upload|contribution">
                  <xsl:choose>
                     <xsl:when test="local-name()='comment'">
                        <xsl:variable name="commentsfilename" select="concat ($Xbaserealdir, '/comments/', file)"/>
                        <xsl:variable name="commentsdocument" select="document(exsl:encode-uri ($commentsfilename, false ()))"/>
                        <tr>
                           <td>Comment</td>
                           <td><xsl:value-of select="$commentsdocument/comment/date"/></td>
                           <td><a href="{concat ('../metadata/', item, '.html')}"><xsl:value-of select="item"/></a></td>
                        </tr>
                     </xsl:when>
                     <xsl:when test="local-name()='contribution'">
                        <tr>
                           <td><xsl:value-of select="role"/></td>
                           <td><xsl:value-of select="date"/></td>
                           <td><a href="{concat ('../metadata/', item, '/index.html')}"><xsl:value-of select="title"/></a></td>
                        </tr>
                     </xsl:when>
                     <xsl:otherwise>
                        <tr><td>Unidentified activity</td><td>.</td><td>.</td></tr>
                     </xsl:otherwise>
                  </xsl:choose>
               </xsl:for-each>
            </table>
            <script>
               tableSort('useractivitytable',1,2);
            </script>
<!--            <xsl:for-each select="comment|upload|contribution">
               <xsl:choose>
                  <xsl:when test="local-name()='comment'">
                     <xsl:variable name="commentsfilename" select="concat ($Xbaserealdir, '/comments/', file)"/>
                     <xsl:variable name="commentsdocument" select="document(exsl:encode-uri ($commentsfilename, false ()))"/>
                     <div class="metadataField">
                        <div class="metadataHeading">Comment</div>
                        <div class="metadataValue">
                           <div class="commentname">Item: <a href="{concat ('../metadata/', item, '.html')}"><xsl:value-of select="item"/></a></div>
                           <div class="commentdate">Date: <xsl:value-of select="$commentsdocument/comment/date"/></div>
                           <div class="commentcontent"><xsl:value-of select="$commentsdocument/comment/content"/></div>
                        </div>
                     </div>
                  </xsl:when>
                  <xsl:when test="local-name()='contribution'">
                     <div class="metadataField">
                        <div class="metadataHeading"><xsl:value-of select="role"/></div>
                        <div class="metadataValue">
                           Item: <a href="{concat ('../metadata/', item, '/index.html')}"><xsl:value-of select="title"/></a>
                        </div>
                     </div>               
                  </xsl:when>
                  <xsl:otherwise>
                     Unidentified activity
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:for-each>
-->
         </div>

         <script>
            makeBreaks ();
         </script>

         </div>
      </body>
   </html>
</xsl:template>

<xsl:template match="page">
   <html>
      <xsl:call-template name="htmlheader"/>
      <xsl:call-template name="banner"/>
      <body onunload="" onLoad="checkCookies ()">
         <xsl:apply-templates select="*|text()"/>
      </body>
   </html>
</xsl:template>

<xsl:template match="page-login">
   <html>
      <xsl:call-template name="htmlheader"/>
      <body onunload="" onLoad="renderLoginButton ()">
         <xsl:apply-templates select="*|text()"/>
      </body>
   </html>
</xsl:template>

<xsl:template match="*">
   <xsl:element name="{local-name()}">
      <xsl:for-each select="@*">
         <xsl:attribute name="{local-name()}"><xsl:value-of select="."/></xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates select="*|text()"/>
   </xsl:element>
</xsl:template>

<xsl:template match="text()">
   <xsl:value-of select="."/>
</xsl:template>

</xsl:stylesheet>

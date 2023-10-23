# configuration and initialisation file

# get directory of this configuration filename
use File::Basename;
$configDir = dirname (__FILE__);

# main directory layout
$dataDir = $configDir.'/..';
$rootDir = $dataDir.'/..';
$binDir = $rootDir.'/simpledl/bin';
$dbDir = $rootDir.'/db';

$moderationDir = $dbDir.'/moderation';
$counterDir = $dbDir.'/counter';
$fulltextDir = $dbDir.'/fulltext';
$commentRenderDir = $dbDir.'/comments';

$spreadsheetDir = $dataDir.'/spreadsheets';
$userDir = $dataDir.'/users';
$uploadDir = $dataDir.'/uploads';
$websiteDir = $dataDir.'/website';
$commentDir = $dataDir.'/comments';
$styleDir = $websiteDir.'/styles';

$renderDir = $rootDir.'/public_html';
$metadataDir = $renderDir.'/metadata';
$userRenderDir = $renderDir.'/users';

$templateDir = $rootDir.'/simpledl/template';
$cgiDir = $renderDir.'/cgi-bin';

# where to copy across website templates from
$templateLocations = [
   [ $templateDir.'/public_html', $renderDir ],
   [ $templateDir.'/cgi-bin', $cgiDir ],
   [ $dataDir.'/website', $renderDir ]
#Addition
];


#Upload locations
# locations of external programs and key files
$uploadMetadataLocation = 'Uploads';
$uploadObjectLocation = 'Uploads';
$xsltproc = '/usr/bin/xsltproc';
$unzip = 'unzip';
$mainstylesheet = $configDir.'/transform.xsl';
# vocabulary
$vocab = {
   'PublicContributor' => 'Site user',
   'InternalContributor' => 'Author'
# vocabulary iteration one end
};
# acceptable file formats for upload
@upload_accept = ('JPG', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'pdf', 'mp3', 'zip');

# administrator accounts
@administrators = (1);
$verifySalt = 135276;

# separators for multiple fields and subfields
$separator = '\|';
$separator2 = '\|';
$separatorClean = '|';
$separator2Clean = '|'; 

# whether or not to use fixed identifiers
#$fixedidentifier = 'identifier';

# manageable directories
$managed = [
   [ 'spreadsheets', $spreadsheetDir ],
   [ 'collection' , $renderDir.'/collection' ],
   [ 'carousel', $websiteDir.'/carousel' ]
];
#EndMD

# list of fields for search and browse and sort
$indexers = {
   'main' => {
      'field_search' => {
     title => 'fullrecord/item/title',
         creator => 'fullrecord/item/creator',
         contributor => 'fullrecord/item/contributor',
         coverage => 'fullrecord/item/coverage',
         date => 'fullrecord/item/date',
         description => 'fullrecord/item/description',
         format => 'fullrecord/item/format',
         identifier => 'fullrecord/item/identifier',
         language => 'fullrecord/item/language',
         publisher => 'fullrecord/item/publisher',
         rights => 'fullrecord/item/rights',
         relation => 'fullrecord/item/relation',
         source => 'fullrecord/item/source',
         subject => 'fullrecord/item/subject',
         type => 'fullrecord/item/type',         

         lod => "fullrecord/item/levelOfDescription",
         comments => "fullrecord/comments/comment/*",
         subcollection => "fullrecord/filename/subpath",
         all => "weight=5 fullrecord/item/title;*//text()"
      },
      #FieldBrowseStart 
      'field_browse' => [ 
       [ title, 'Title', 'title' ],
       [ creator, 'Author', 'creator' ],
       [ date, 'Date', 'date' ], 
       [ publisher, 'Publisher', 'publisher' ]
      ],#FieldBrowseEND
      'field_sort' => [ 
         relevance,
         title, 
         date
      ],
      'field_index' => [
         [ 1, "metadata +fulltext +comments", "$metadataDir,$commentRenderDir,$fulltextDir" ],
         [ 2, "metadata +comments", "$metadataDir,$commentRenderDir" ],
         [ 3, "metadata", "$metadataDir" ]
      ], 
      'file_exclude' => { 
         'index.xml'=> 1,
         './metadata.xml'=> 1, #ASK ABOUT THIS
      },
      'title_match' => '*//title'
   },
   'users' => {
      'field_search' => {
         name => 'fullrecord/user/name',
         type => 'fullrecord/user/type',
         all => "weight=100 fullrecord/user/name;*//text()"
      },
      'field_browse' => [   
         [ publisher, 'Publisher', 'publisher' ]],
#      [ 
#         type
#      ],
      'field_sort' => [
         relevance,
         name
      ],
      'field_index' => [
         [ 1, "users", "$userRenderDir" ]], #TO DO 
         
      'file_exclude' => { 
         'index.xml'=> 1 
      },
      'title_match' => '*//name'
   }   
};

# how to structure uploads based on a field
$uploadStructure = {
   'radGeneralMaterialDesignation' => {
       'Books and book chapters' => 'published/books',
       'Published articles' => 'published/articles',
       'Dictionaries' => 'published/dictionaries',
       'Periodical, newspaper and magazine extracts' => 'published/periodicals',
       'Theses and dissertations' => 'unpublished/theses',
       'Academic papers' => 'unpublished/academicpapers',
       'Miscellaneous papers (including diaries, fieldnotes and correspondence)' => 'unpublished/miscellaneous',
       'Objects' => 'objects',
       'Images' => 'images',
       'Sound' => 'sound',
       'Other' => 'other'
   }
};


#use Data::Dumper;
#print Dumper ($indexers);

   

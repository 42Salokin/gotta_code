const router = require('express').Router();
 
router.get('/', async (req, res) => {
    try {
    //   const dbGalleryData = await Gallery.findAll({
    //     include: [
    //       {
    //         model: Painting,
    //         attributes: ['filename', 'description'],
    //       },
    //     ],
    //   });
  
    //   const galleries = dbGalleryData.map((gallery) =>
    //     gallery.get({ plain: true })
    //   );
  
      res.render('homepage' // { galleries }


      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.get('/signup', (req, res) => {
    try {
      res.render('login')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  })
  
  
  router.get('/login', (req, res) => {
    try {
      res.render('login')
    } catch (err) {
      console.error(err)
      res.status(500).json(err)
    }
  })

  module.exports = router;

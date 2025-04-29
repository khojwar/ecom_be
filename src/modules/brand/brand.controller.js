class BrandController {

    /**
     * CRUD operations for brands
     * read by url (string-slug => /:id, /:slug)
     */

    createBrand = async (req, res) => {
        try {
            const { name, slug } = req.body;
            const brand = await this.brandService.createBrand({ name, slug });
            return res.status(201).json(brand);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    updateBrand = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, slug } = req.body;
            const brand = await this.brandService.updateBrand(id, { name, slug });
            return res.status(200).json(brand);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    listAllBrands = async (req, res) => {
        try {
            const brands = await this.brandService.listAllBrands();
            return res.status(200).json(brands);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    viewBrandDetails = async (req, res) => {
        try {
            const { id } = req.params;
            const brand = await this.brandService.viewBrandDetails(id);
            return res.status(200).json(brand);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    deleteBrand = async (req, res) => {
        try {
            const { id } = req.params;
            await this.brandService.deleteBrand(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    readbyUrl = async (req, res) => {
        try {
            const { slug } = req.params;
            const brand = await this.brandService.readByUrl(slug);
            return res.status(200).json(brand);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}

module.exports = { BrandController };
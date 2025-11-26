import { NextRequest, NextResponse } from 'next/server'
import { parseCSV } from '@/lib/parsers/csv'
import { parseXLSX } from '@/lib/parsers/xlsx'
import { parseJSON } from '@/lib/parsers/json'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const tenantId = req.headers.get('x-tenant') ?? 'default'
        const ext = file.name.split('.').pop()?.toLowerCase()

        let rows: Record<string, unknown>[] = []

        if (ext === 'csv') {
            const text = await file.text()
            rows = parseCSV(text)
        } else if (ext === 'xlsx' || ext === 'xls') {
            const buffer = await file.arrayBuffer()
            rows = parseXLSX(buffer)
        } else if (ext === 'json') {
            const text = await file.text()
            rows = parseJSON(text)
        } else {
            return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
        }

        // TODO: Store in import_jobs, trigger async processing
        // For now, return preview
        return NextResponse.json({
            tenant: tenantId,
            rows: rows.slice(0, 10),
            total: rows.length,
            message: 'Preview OK. Async processing not yet implemented.',
        })
    } catch (error: unknown) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { useState } from 'react'

const formSchema = z.object({
    concept: z
        .string({ required_error: 'El concepto es requerido' })
        .min(2, {
            message: 'El concepto no puede ser inferior a 2 caractéres'
        })
        .max(20, {
            message: 'El concepto no puede ser superior a 20 caractéres'
        }),
    purchaseDate: z.date(),
    currency: z.enum(['ARS', 'USD'], {
        required_error: 'La moneda es requerida'
    }),
    totalAmount: z
        .string({
            required_error: 'El importe es requerido'
        })
        .regex(
            /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/,
            'El importe debe tener el formato correcto (ej: 1.234,56)'
        ),
    condition: z.enum(['cash', 'financed'], {
        required_error: 'La condición es requerida'
    }),
    numberQuotas: z.string()
})

export const PurchaseForm = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            concept: '',
            purchaseDate: new Date(),
            currency: 'ARS',
            totalAmount: '',
            condition: 'cash',
            numberQuotas: '1'
        }
    })

    // Función para formatear con puntos de miles y coma decimal
    const formatToThousands = (value: string): string => {
        // Elimina todo excepto números y coma
        const cleanedValue = value.replace(/[^\d,]/g, '')

        // Separa parte entera y decimal
        const [integerPart, decimalPart] = cleanedValue.split(',')

        // Inserta puntos de miles manualmente
        const formattedInteger = integerPart
            ?.split('')
            .reverse()
            .map((char, index) =>
                index > 0 && index % 3 === 0 ? `${char}.` : char
            )
            .reverse()
            .join('')

        // Retorna el valor reconstruido
        return decimalPart !== undefined
            ? `${formattedInteger},${decimalPart}`
            : formattedInteger || ''
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            console.log(values)

            const res = await fetch('/api/purchase', {
                method: 'POST',
                body: JSON.stringify(values)
            })

            if (!res.ok) throw new Error('Error en la respuesta del servidor')
            form.reset()
        } catch (error) {
            console.error('Error al enviar el formulario:', error)
            alert(
                'Hubo un error al registrar el ingreso. Por favor, intente de nuevo.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-[350px] w-full rounded-lg p-6 space-y-3"
            >
                {/* CONCEPT INPUT */}
                <FormField
                    control={form.control}
                    name="concept"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Concepto de egreso</FormLabel>
                            <FormControl>
                                <Input {...field} autoComplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* DATE INPUT */}
                <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fecha del egreso</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={'outline'}>
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        'dd/MM/yyy'
                                                    )
                                                ) : (
                                                    <span>Elige una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="center"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={date =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* CURRENCY INPUT */}
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Moneda</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-5"
                                >
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="ARS" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            ARS
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="USD" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            USD
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* IMPORTE INPUT */}
                <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Importe</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    autoComplete="off"
                                    {...field}
                                    onChange={e => {
                                        const inputValue = e.target.value
                                        const formattedValue =
                                            formatToThousands(inputValue)
                                        field.onChange(formattedValue)
                                    }}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Condición</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-5"
                                >
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="cash" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Contado
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="financed" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Financiado
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {form.getValues().condition === 'financed' && (
                    <FormField
                        control={form.control}
                        name="numberQuotas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cuotas</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="animate-spin" />}
                    REGISTRAR
                </Button>
            </form>
        </Form>
    )
}
